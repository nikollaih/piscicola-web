import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx'
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import {useEffect, useState, useRef} from "react";

export default function CreateProductiveUnit({ auth, productive_unit, associations }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        association_id: null,
        name: '',
        email: '',
        mobile_phone: '',
        phone: '',
        address:'',
        mqtt_id: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [associationTitle, setAssociationTitle] = useState('Seleccionar');

    useEffect(() => {
        if(pageProps?.productive_unit?.id){
            setProductiveUnitData(pageProps.productive_unit);
        }
    }, [])

    const setProductiveUnitData = (productive_unit) => {
        setData({
            association_id: productive_unit.association_id,
            name: productive_unit.name,
            email: productive_unit.email,
            mobile_phone: productive_unit.mobile_phone,
            phone: productive_unit.phone,
            address: productive_unit.address,
            mqtt_id: productive_unit.mqtt_id
        });

        setAssociationTitle(productive_unit.association.name);
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.productive_unit?.id){
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
        let successAction = "modificada";
        if(!pageProps?.productive_unit?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the productive_unit
        setSuccessMessage('La unidad productiva fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getAssociationDropdownDom = () => {
        return associations.map((item) => {
            return <DropDownItem onClick={() => {setSelectedAssociation(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedAssociation = (association) => {
        setAssociationTitle(association.name);
        setData({...data, association_id: association.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.productive_unit?.id) ? "Modificar" : "Agregar"} unidad productiva</h2>}
        >
            <Head title="Asociación" />
            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="bg-white shadow-sm sm:rounded-lg p-5 mb-6">
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Asociación"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{associationTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getAssociationDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.measurement_unit_id) ?
                                        <InputError message={hasErrors.measurement_unit_id}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-3">
                                    <InputLabel value="Nombre"/>
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
                                <div className="w-full md:col-span-1 sm:col-span-3">
                                    <InputLabel value="Celular"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="mobile_phone"
                                        value={data.mobile_phone}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.mobile_phone) ?
                                        <InputError message={hasErrors.mobile_phone}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-3">
                                    <InputLabel value="Teléfono"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.phone) ?
                                        <InputError message={hasErrors.phone}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-3">
                                    <InputLabel value="Correo electrónico"/>
                                    <TextInput
                                        type="email"
                                        className="w-full"
                                        placeholder=""
                                        name="email"
                                        value={data.email}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.email) ?
                                        <InputError message={hasErrors.email}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-3">
                                    <InputLabel value="MQTT ID"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        placeholder=""
                                        name="mqtt_id"
                                        value={data.mqtt_id}
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.mqtt_id) ?
                                        <InputError message={hasErrors.mqtt_id}/> : ""}
                                </div>
                                <div className="w-full md:col-span-3 sm:col-span-3">
                                    <InputLabel value="Dirección"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        placeholder=""
                                        name="address"
                                        value={data.address}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.address) ?
                                        <InputError message={hasErrors.address}/> : ""}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-4">
                            <Link href={route('productive_units')}>
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
