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

export default function CreateUser({ auth, usersUrl, roles }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;
    const { data, setData, post, patch, reset, setDefaults, processing } = useForm({
        document: null,
        name: '',
        mobile_phone: null,
        email: '',
        role_id: 2,
        password: '',
        password_confirmation: ''
    });

    const [roleTitle, setRoleTitle] = useState('Manager');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if(pageProps?.user?.id){
            setUserData(pageProps.user);
        }
    }, [])

    const setUserData = (user) => {
        setData({
            document: user.document,
            name: user.name,
            mobile_phone: user.mobile_phone,
            email: user.email,
            role_id: user.role_id
        });

        setRoleTitle(roles.filter((r) => r.id === user.role_id).at(0).name);
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.user?.id){
            patch(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit()
            });
        }
        else {
            console.log(data)
            post(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit(),
            });
        }
    }

    const onSuccessSubmit = () => {
        let successAction = "modificado";
        if(!pageProps?.user?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the user
        setSuccessMessage('El usuario fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }


    const setSelectedRole = (role) => {
        setData({...data, role_id: role.id});
        setRoleTitle(role.name);
    }

    const getRolesDropdownDom = () => {
        return roles.map((role) => {
            return <DropDownItem onClick={() => {setSelectedRole(role)}}>{role.name}</DropDownItem>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.user?.id) ? "Modificar" : "Agregar"} usuario</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-4 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Usuarios</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {(pageProps?.user?.id) ? "Modificar" : "Agregar"}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Rol"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{roleTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getRolesDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.name) ? <InputError message={hasErrors.role_id}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Documento"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder="123456789"
                                        name="document"
                                        value={data.document}
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.document) ? <InputError message={hasErrors.document}/> : ""}
                                </div>
                                <div className="md:col-span-2 sm:col-span-4">
                                    <InputLabel value="Nombre Completo"/>
                                    <TextInput
                                        type="text"
                                        name="name"
                                        className="w-full"
                                        value={data.name}
                                        onChange={(e) => setData(e.target.name, e.target.value.toUpperCase())}/>
                                    {(hasErrors?.name) ? <InputError message={hasErrors.name}/> : ""}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full">
                                    <InputLabel value="Celular"/>
                                    <TextInput
                                        type="number"
                                        name="mobile_phone"
                                        className="w-full"
                                        placeholder="123456789"
                                        value={data.mobile_phone}
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.mobile_phone) ? <InputError message={hasErrors.mobile_phone}/> : ""}
                                </div>
                                <div className="w-full">
                                    <InputLabel value="Correo electrónico"/>
                                    <TextInput
                                        type="email"
                                        name="email"
                                        className="w-full"
                                        placeholder="johndoe@example.com"
                                        value={data.email}
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.email) ? <InputError message={hasErrors.email}/> : ""}
                                </div>
                            </div>
                            {
                                (!pageProps?.user?.id) ?
                                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                        <div className="w-full">
                                            <InputLabel value="Contraseña (Minimo 8 carácteres)"/>
                                            <TextInput
                                                type="password"
                                                name="password"
                                                className="w-full"
                                                placeholder="********"
                                                value={data.password}
                                                onChange={(e) => setData(e.target.name, e.target.value)}/>
                                            {(hasErrors?.mobile_phone) ?
                                                <InputError message={hasErrors.password}/> : ""}
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value="Repetir contraseña"/>
                                            <TextInput
                                                type="password"
                                                name="password_confirmation"
                                                className="w-full"
                                                placeholder="********"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData(e.target.name, e.target.value)}/>
                                            {(hasErrors?.email) ?
                                                <InputError message={hasErrors.password_confirmation}/> : ""}
                                        </div>
                                    </div> : null
                            }

                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <Link className="w-full sm:w-auto" href={usersUrl}>
                                <PrimaryButton className="gray bg-gray-800 w-full sm:w-auto text-white">Regresar</PrimaryButton>
                            </Link>
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
        </AuthenticatedLayout>
    );
}
