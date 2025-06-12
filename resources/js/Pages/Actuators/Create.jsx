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
import Swal from "sweetalert2";
import { useEffect, useState, useRef } from "react";

export default function CreateActuator({ auth, ponds, actuatorTypes, goBackRoute }) {
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        pond_id: null,
        name: "",
        actuator_type_id: null,
        description: "",
        cost_by_minute: "",
        mqtt_id: ""
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [pondTitle, setPondTitle] = useState('Seleccionar');
    const [actuatorTypeTitle, setActuatorTypeTitle] = useState('Seleccionar');

    useEffect(() => {
        if (pageProps?.actuator?.id) {
            setActuatorData(pageProps.actuator);
        }
    }, []);

    const setActuatorData = (actuator) => {
        setData({
            pond_id: actuator.pond_id,
            name: actuator.name,
            actuator_type_id: actuator.actuator_type_id,
            description: actuator.description,
            cost_by_minute: actuator.cost_by_minute,
            mqtt_id: actuator.mqtt_id
        });

        setActuatorTypeTitle(actuator.actuator_type.name);
        setPondTitle(actuator.pond.name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pageProps?.actuator?.id) {
            patch(pageProps.formActionUrl, { onSuccess: () => onSuccessSubmit() });
        } else {
            post(pageProps.formActionUrl, { onSuccess: () => onSuccessSubmit() });
        }
    };

    const onSuccessSubmit = () => {
        let successAction = pageProps?.actuator?.id ? "modificado" : "agregado";
        if (!pageProps?.actuator?.id) reset();
        setSuccessMessage(`El actuador fue ${successAction} satisfactoriamente`);
        buttonResetRef.current.click();
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `Se eliminará el actuador “${pageProps.actuator.name}” permanentemente.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(route('actuator.delete', { actuatorId: pageProps.actuator.id }), {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content'),
                        'Accept': 'application/json',
                    }
                });

                const json = await res.json();

                if (res.ok) {
                    Swal.fire({
                        title: "Eliminado",
                        text: json.msg,
                        icon: "success",
                        confirmButtonText: "Continuar",
                        customClass: {
                            confirmButton: 'swal2-confirm'
                        },
                        buttonsStyling: false
                    }).then(() => {
                        router.visit(route('actuators'));
                    });
                } else {
                    throw new Error(json.msg || "Error al eliminar");
                }

            } catch (err) {
                Swal.fire({
                    title: "Error",
                    text: err.message || "Ocurrió un error inesperado",
                    icon: "error"
                });
            }
        }
    };

    const getMUDropdownDom = () => {
        return ponds.data.map((item) => (
            <DropDownItem onClick={() => setSelectedPond(item)} key={item.id}>{item.name}</DropDownItem>
        ));
    };

    const setSelectedPond = (pond) => {
        setPondTitle(pond.name);
        setData({ ...data, pond_id: pond.id });
    };

    const getActuatorTypeDom = () => {
        return actuatorTypes.map((item) => (
            <DropDownItem onClick={() => setSelectedActuatorType(item)} key={item.id}>{item.name}</DropDownItem>
        ));
    };

    const setSelectedActuatorType = (actuatorType) => {
        setActuatorTypeTitle(actuatorType.name);
        setData({ ...data, actuator_type_id: actuatorType.id });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Actuador" />
            <div className="lg:py-12 py-4">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <Link href="/sowings" className="hover:text-gray-700">Infraestructura</Link>
                                        <span className="mx-2">{'>'}</span>
                                        <span className="text-gray-700">
                                            {pageProps?.actuator?.id ? "Editar Actuador" : "Agregar Actuador"}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {pageProps?.actuator?.id ? "Editar" : "Nuevo"} Actuador
                                    </h2>
                                </div>
                            </div>
                            <Link className="w-full sm:w-auto" href={goBackRoute}>
                                <PrimaryButton>Regresar</PrimaryButton>
                            </Link>
                        </div>
                        <br />
                        <div className="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid grid-cols-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 col-span-1 gap-4 mb-4">
                                    <div>
                                        <InputLabel value="Nombre" />
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
                                    <div>
                                        <InputLabel value="Costo por minuto" />
                                        <TextInput
                                            type="number"
                                            className="w-full"
                                            name="cost_by_minute"
                                            value={data.cost_by_minute}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.cost_by_minute && <InputError message={hasErrors.cost_by_minute} />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 mb-4">
                                    <div>
                                        <InputLabel value="Estanque" />
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle className="items-center cursor-pointer">
                                                    {pondTitle}
                                                </DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getMUDropdownDom()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {hasErrors?.pond_id && <InputError message={hasErrors.pond_id} />}
                                    </div>
                                    <div>
                                        <InputLabel value="Tipo de actuador" />
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle className="items-center cursor-pointer">
                                                    {actuatorTypeTitle}
                                                </DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getActuatorTypeDom()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {hasErrors?.actuator_type_id && <InputError message={hasErrors.actuator_type_id} />}
                                    </div>
                                    <div>
                                        <InputLabel value="MQTT ID" />
                                        <TextInput
                                            type="text"
                                            className="w-full"
                                            name="mqtt_id"
                                            value={data.mqtt_id}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.mqtt_id && <InputError message={hasErrors.mqtt_id} />}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value="Descripción" />
                                    <TextArea
                                        className="w-full"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.description && <InputError message={hasErrors.description} />}
                                </div>
                            </div>
                        </div>

                        {pageProps?.actuator?.id && (
                            <div className="bg-white shadow-sm rounded-lg p-5 mt-6 border border-gray-300">
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">Eliminación</h2>
                                <p className="mb-4 text-gray-600">
                                    Se eliminará permanentemente el actuador “
                                    <strong>{pageProps.actuator.name}</strong>”. Verifica que sea la acción que quieres realizar.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Eliminar actuador
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

                <style>
                    {`
                        .swal2-confirm {
                            background-color: #dc2626 !important;
                            color: white !important;
                            border-radius: 4px;
                            padding: 8px 20px;
                            font-weight: bold;
                        }

                        .swal2-confirm:hover {
                            background-color: #b91c1c !important;
                        }

                        .swal2-cancel {
                            background-color: #e5e7eb !important;
                            color: #374151 !important;
                            border-radius: 4px;
                            padding: 8px 20px;
                        }

                        .swal2-cancel:hover {
                            background-color: #d1d5db !important;
                        }
                    `}
                </style>
            </div>
        </AuthenticatedLayout>
    );
}
