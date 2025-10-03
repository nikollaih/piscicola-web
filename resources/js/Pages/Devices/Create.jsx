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
import TextArea from "@/Components/TextArea.jsx";

export default function CreateDevice({ auth, devicesUrl, ponds, device }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        name: '',
        category: '',
        maintenance_period: "",
        description: "",
        pond_id: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [categoryTitle, setPondTitle] = useState('Seleccionar');

    useEffect(() => {
        if(device?.id){
            setDeviceData(device);
        }
    }, [])

    const setDeviceData = (device) => {
        setData({
            name: device.name,
            category: device.category,
            maintenance_period: device.maintenance_period,
            description: device.description,
            pond_id: device.pond_id
        });

        const selectedPond = ponds?.data?.filter((p) => p.id === device?.pond_id);
        setPondTitle( Array.isArray(selectedPond) ? selectedPond[0]?.name : 'Seleccionar');
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.device?.id){
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
        if(!pageProps?.device?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the device
        setSuccessMessage('El dispositivo fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getPondDropdownDom = () => {
        return ponds?.data?.map((item) => {
            return <DropDownItem onClick={() => {setSelectedPond(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedPond = (devicePond) => {
        setPondTitle(devicePond.name);
        setData({...data, pond_id: devicePond.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dispositivo" />
            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="p-6">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Dispositivos</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Crear un Dispositivo
                                </h2>
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
                                    <div className="w-full md:col-span-2 sm:col-span-4">
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
                                    <div className="md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Estanque"/>
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle
                                                    className="items-center cursor-pointer">{categoryTitle}</DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                <DropDownItem onClick={() => {
                                                    setSelectedPond({id: '', name: 'No aplica'})
                                                }}>No aplica</DropDownItem>
                                                {getPondDropdownDom()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {(hasErrors?.category_id) ?
                                            <InputError message={hasErrors.category_id}/> : ""}
                                    </div>
                                    <div className="w-full md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Categoria"/>
                                        <TextInput
                                            type="text"
                                            className="w-full"
                                            placeholder="Manguera"
                                            name="category"
                                            value={data.category}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.category) ?
                                            <InputError message={hasErrors.category}/> : ""}
                                    </div>
                                    <div className="w-full md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Periodo de mantenimiento (En días)"/>
                                        <TextInput
                                            type="number"
                                            className="w-full"
                                            placeholder="15"
                                            name="maintenance_period"
                                            value={data.maintenance_period}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.maintenance_period) ?
                                            <InputError message={hasErrors.maintenance_period}/> : ""}
                                    </div>
                                    <div className="w-full md:col-span-4 sm:col-span-4">
                                        <InputLabel value="Notas"/>
                                        <TextArea
                                            className="w-full"
                                            placeholder=""
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.description) ?
                                            <InputError message={hasErrors.description}/> : ""}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-end mt-4">
                                <Link className="w-full sm:w-auto" href={devicesUrl}>
                                    <PrimaryButton
                                        className="gray bg-gray-800 w-full sm:w-auto text-white">Regresar</PrimaryButton>
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
            </div>
        </AuthenticatedLayout>
    );
}
