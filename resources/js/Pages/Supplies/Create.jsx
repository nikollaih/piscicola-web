import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import TextArea from "@/Components/TextArea.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx';
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Constants from "@/../Constants.js";
import Swal from 'sweetalert2';

export default function CreateSupply({ auth, measurements, suppliesUrl, supply }) {
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        measurement_unit: null,
        name: "",
        use_type: null,
        total_price: "",
        quantity: "",
        available_quantity: "",
        notes: "",
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [measurementUnitTitle, setMeasurementUnitTitle] = useState('Seleccionar');
    const [useTitle, setUseTitle] = useState('Seleccionar');

    useEffect(() => {
        if (pageProps?.supply?.id) {
            setSupplyData(pageProps.supply);
        }
    }, []);

    const setSupplyData = (supply) => {
        setData({
            measurement_unit_id: supply.measurement_unit_id,
            name: supply.name,
            use_type: supply.use_type,
            notes: supply.notes
        });

        setUseTitle(Constants.SUPPLIES_USES_TYPES[supply.use_type]);
        setMeasurementUnitTitle(supply.measurement_unit.name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pageProps?.supply?.id) {
            patch(pageProps.formActionUrl, { onSuccess: () => onSuccessSubmit() });
        } else {
            post(pageProps.formActionUrl, { onSuccess: () => onSuccessSubmit() });
        }
    };

    const onSuccessSubmit = () => {
        let successAction = pageProps?.supply?.id ? "modificado" : "agregado";
        if (!pageProps?.supply?.id) reset();
        setSuccessMessage(`El suministro fue ${successAction} satisfactoriamente`);
        buttonResetRef.current.click();
    };

    const handleDelete = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: `Se eliminará permanentemente el suministro "${pageProps.supply.name}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('supply.delete', { supplyId: pageProps.supply.id }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Eliminado",
                            text: "El suministro fue eliminado satisfactoriamente.",
                            icon: "success"
                        });
                        router.visit(route('supplies'));
                    },
                    onError: () => {
                        Swal.fire({
                            title: "Error",
                            text: "Ocurrió un error al intentar eliminar el suministro.",
                            icon: "error"
                        });
                    }
                });
            }
        });
    };

    const getMUDropdownDom = () => {
        return measurements.map((item) => (
            <DropDownItem key={item.id} onClick={() => setSelectedMU(item)}>
                {item.name}
            </DropDownItem>
        ));
    };

    const setSelectedMU = (measurement) => {
        setMeasurementUnitTitle(measurement.name);
        setData({ ...data, measurement_unit_id: measurement.id });
    };

    const getUseDropdownDom = () => {
        let uses = Constants.SUPPLIES_USES_TYPES;
        let usesDom = [];
        for (let key in uses) {
            usesDom.push(
                <DropDownItem key={key} onClick={() => setSelectedUse(key, uses[key])}>
                    {uses[key]}
                </DropDownItem>
            );
        }
        return usesDom;
    };

    const setSelectedUse = (use, value) => {
        setUseTitle(value);
        setData({ ...data, use_type: use });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Agregar suministro" />
            <div className="py-4 lg:py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="mb-4">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <Link href="/supplies" className="hover:text-gray-700">Infraestructura</Link>
                                        <span className="mx-2">{'>'}</span>
                                        <span className="text-gray-700">
                                            {pageProps?.supply?.id ? "Editar Suministro" : "Agregar Suministro"}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {pageProps?.supply?.id ? "Editar" : "Nuevo"} Suministro
                                    </h2>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {pageProps?.supply?.id ? "Editar" : "Nuevo"} Suministro
                                </h2>
                            </div>
                            <Link className="w-full sm:w-auto" href={route('supplies')}>
                                <PrimaryButton className="bg-neutral-800">Regresar</PrimaryButton>
                            </Link>
                        </div>

                        <div className="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                                <div className="w-full">
                                    <InputLabel value="Nombre del producto" />
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        name="name"
                                        value={data.name}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.name && <InputError message={hasErrors.name} />}
                                </div>

                                {!supply?.id && (
                                    <>
                                        <div className="w-full">
                                            <InputLabel value="Cantidad" />
                                            <TextInput
                                                type="number"
                                                className="w-full"
                                                name="quantity"
                                                value={data.quantity}
                                                required
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                            />
                                            {hasErrors?.quantity && <InputError message={hasErrors.quantity} />}
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value="Precio" />
                                            <TextInput
                                                type="number"
                                                className="w-full"
                                                name="total_price"
                                                value={data.total_price}
                                                required
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                            />
                                            {hasErrors?.total_price && <InputError message={hasErrors.total_price} />}
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value="Fecha de compra" />
                                            <TextInput
                                                type="date"
                                                className="w-full"
                                                name="manual_created_at"
                                                value={data.manual_created_at}
                                                required
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                            />
                                            {hasErrors?.manual_created_at && <InputError message={hasErrors.manual_created_at} />}
                                        </div>
                                    </>
                                )}

                                <div className="w-full">
                                    <InputLabel value="Unidad de medida" />
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle className="items-center cursor-pointer">
                                                {measurementUnitTitle}
                                            </DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getMUDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {hasErrors?.measurement_unit_id && <InputError message={hasErrors.measurement_unit_id} />}
                                </div>

                                <div className="w-full">
                                    <InputLabel value="Uso" />
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle className="items-center cursor-pointer">
                                                {useTitle}
                                            </DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getUseDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {hasErrors?.use_type && <InputError message={hasErrors.use_type} />}
                                </div>

                                <div className="w-full md:col-span-2 lg:col-span-3">
                                    <InputLabel value="Notas" />
                                    <TextArea
                                        className="w-full"
                                        name="notes"
                                        value={data.notes}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.notes && <InputError message={hasErrors.notes} />}
                                </div>
                            </div>
                        </div>

                        {pageProps?.supply?.id && (
                            <div className="bg-white shadow-sm rounded-lg p-5 mt-6 border border-gray-300">
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">Eliminación</h2>
                                <p className="mb-4 text-gray-600">
                                    Se eliminará permanentemente el suministro “
                                    <strong>{pageProps.supply.name}</strong>”. Verifica que sea la acción que quieres realizar.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Eliminar suministro
                                </button>
                            </div>
                        )}

                        <div className="flex gap-4 justify-end mt-4">
                            <PrimaryButton
                                className="bg-orange-600 w-full sm:w-auto text-white"
                                disabled={processing}
                            >
                                Guardar
                            </PrimaryButton>
                            <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                        </div>
                    </div>
                </form>
            </div>

            <style>
                {`
                    .swal2-confirm.btn-confirm {
                        background-color: #f5f5f5 !important;
                        color: #dc2626 !important;
                        font-weight: bold;
                        border: 1px solid #dc2626 !important;
                        border-radius: 4px;
                        padding: 8px 20px;
                    }

                    .swal2-confirm.btn-confirm:hover {
                        background-color: #ffecec !important;
                        color: #b91c1c !important;
                    }

                    .swal2-cancel.btn-cancel {
                        background-color: #e5e7eb !important;
                        color: #374151 !important;
                        border-radius: 4px;
                        padding: 8px 20px;
                    }

                    .swal2-cancel.btn-cancel:hover {
                        background-color: #d1d5db !important;
                        color: #1f2937 !important;
                    }
                `}
            </style>
        </AuthenticatedLayout>
    );
}
