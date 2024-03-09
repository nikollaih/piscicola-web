import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import TextArea from "@/Components/TextArea.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx'
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import {useEffect, useState, useRef} from "react";
import moment from "moment";
import Constants from "@/../Constants.js";

export default function CreateSupply({ auth, measurements, suppliesUrl, supply }) {
    // Create a ref for the reset button
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
        if(pageProps?.supply?.id){
            setSupplyData(pageProps.supply);
        }
    }, [])

    const setSupplyData = (supply) => {
        console.log(supply)
        setData({
            measurement_unit_id: supply.measurement_unit_id,
            name: supply.name,
            use_type: supply.use_type,
            notes: supply.notes
        });

        setUseTitle(Constants.SUPPLIES_USES_TYPES[supply.use_type]);
        setMeasurementUnitTitle(supply.measurement_unit.name)
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.supply?.id){
            patch(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit()
            });
        }
        else {
            post(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit(),
            });
        }
    }

    const onSuccessSubmit = () => {
        let successAction = "modificado";
        if(!pageProps?.supply?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the supply
        setSuccessMessage('El suministro fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getMUDropdownDom = () => {
        return measurements.map((item) => {
            return <DropDownItem onClick={() => {setSelectedMU(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedMU = (measurement) => {
        setMeasurementUnitTitle(measurement.name);
        setData({...data, measurement_unit_id: measurement.id});
    }

    const getUseDropdownDom = () => {
        let uses = Constants.SUPPLIES_USES_TYPES;
        let usesDom = [];
        for (let key in uses) {
            usesDom.push(<DropDownItem onClick={() => {setSelectedUse(key, uses[key])}}>{uses[key]}</DropDownItem>);
        }

        return usesDom;
    }

    const setSelectedUse = (use, value) => {
        setUseTitle(value);
        setData({...data, use_type: use});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.supply?.id) ? "Modificar" : "Agregar"} suministro</h2>}
        >
            <Head title="Agregar suministro" />
            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm sm:rounded-lg p-5">
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Nombre del producto"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        placeholder=""
                                        name="name"
                                        value={data.name}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.name) ?
                                        <InputError message={hasErrors.name}/> : ""}
                                </div>
                                {
                                    (!supply?.id)
                                        ?
                                            <div className="w-full md:col-span-1 sm:col-span-4">
                                                <InputLabel value="Cantidad"/>
                                                <TextInput
                                                    type="number"
                                                    className="w-full"
                                                    placeholder=""
                                                    name="quantity"
                                                    value={data.quantity}
                                                    required
                                                    onChange={(e) => setData(e.target.name, e.target.value)}/>
                                                {(hasErrors?.quantity) ?
                                                    <InputError message={hasErrors.quantity}/> : ""}
                                            </div>
                                        : null
                                }

                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Unidad de medida"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{measurementUnitTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getMUDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.measurement_unit_id) ? <InputError message={hasErrors.measurement_unit_id}/> : ""}
                                </div>
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Uso"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{useTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getUseDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.use_type) ? <InputError message={hasErrors.use_type}/> : ""}
                                </div>
                                {
                                    (!supply?.id)
                                        ?
                                        <div className="w-full md:col-span-1 sm:col-span-4">
                                            <InputLabel value="Precio"/>
                                            <TextInput
                                                type="number"
                                                className="w-full"
                                                placeholder=""
                                                name="total_price"
                                                value={data.total_price}
                                                required
                                                onChange={(e) => setData(e.target.name, e.target.value)}/>
                                            {(hasErrors?.total_price) ?
                                                <InputError message={hasErrors.total_price}/> : ""}
                                        </div>
                                        : null
                                }
                                {
                                    (!supply?.id)
                                        ?
                                        <div className="w-full md:col-span-1 sm:col-span-4">
                                            <InputLabel value="Fecha de compra"/>
                                            <TextInput
                                                type="date"
                                                className="w-full"
                                                placeholder=""
                                                name="manual_created_at"
                                                value={data.manual_created_at}
                                                required
                                                onChange={(e) => setData(e.target.name, e.target.value)}/>
                                            {(hasErrors?.manual_created_at) ?
                                                <InputError message={hasErrors.manual_created_at}/> : ""}
                                        </div>
                                        : null
                                }
                                <div className="w-full md:col-span-3 sm:col-span-4">
                                    <InputLabel value="Notas"/>
                                    <TextArea
                                        className="w-full"
                                        placeholder=""
                                        name="notes"
                                        value={data.notes}
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.notes) ?
                                        <InputError message={hasErrors.notes}/> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <Link href={route('supplies')}>
                                <PrimaryButton className="gray bg-gray-800">Regresar</PrimaryButton>
                            </Link>
                            <PrimaryButton
                                className="bg-orange-600"
                                disabled={processing}
                            >
                                Guardar
                            </PrimaryButton>
                            <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
