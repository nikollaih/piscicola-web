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
import moment from "moment";
import Constants from "@/../Constants.js";
import TextArea from "@/Components/TextArea.jsx";

export default function CreateAssociation({ auth, association }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        name: '',
        email: '',
        mobile_phone: '',
        phone: '',
        address:''
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if(pageProps?.association?.id){
            setAssociationData(pageProps.association);
        }
    }, [])

    const setAssociationData = (association) => {
        setData({
            name: association.name,
            email: association.email,
            mobile_phone: association.mobile_phone,
            phone: association.phone,
            address: association.address
        });
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.association?.id){
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
        if(!pageProps?.association?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the association
        setSuccessMessage('La asociación fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.association?.id) ? "Modificar" : "Agregar"} asociación</h2>}
        >
            <Head title="Asociación" />
            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
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
                                <div className="w-full md:col-span-2 sm:col-span-3">
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
                            <Link href={route('associations')}>
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
