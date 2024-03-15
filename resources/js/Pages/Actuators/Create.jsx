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

export default function CreateActuator({ auth, ponds, actuatorTypes, goBackRoute }) {
    // Create a ref for the reset button
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
        if(pageProps?.actuator?.id){
            setActuatorData(pageProps.actuator);
        }
    }, [])

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
        setPondTitle(actuator.pond.name)
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.actuator?.id){
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
        if(!pageProps?.actuator?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the actuator
        setSuccessMessage('El actuador fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getMUDropdownDom = () => {
        return ponds.data.map((item) => {
            return <DropDownItem onClick={() => {setSelectedPond(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedPond = (pond) => {
        setPondTitle(pond.name);
        setData({...data, pond_id: pond.id});
    }

    const getActuatorTypeDom = () => {
        return actuatorTypes.map((item) => {
            return <DropDownItem onClick={() => {setSelectedActuatorType(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedActuatorType = (actuatorType) => {
        setActuatorTypeTitle(actuatorType.name);
        setData({...data, actuator_type_id: actuatorType.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.actuator?.id) ? "Modificar" : "Agregar"} actuador</h2>}
        >
            <Head title="Actuador" />
            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm sm:rounded-lg p-5">
                            <div className="grid grid-cols-1">
                                <div className="grid grid-cols-2 col-span-1 gap-4 mb-4">
                                    <div className="md:col-span-1 sm:col-span-4">
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
                                    <div className="md:col-span-1 sm:col-span-4">
                                        <InputLabel value="Costo por minuto"/>
                                        <TextInput
                                            type="number"
                                            className="w-full"
                                            placeholder=""
                                            name="cost_by_minute"
                                            value={data.cost_by_minute}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.cost_by_minute) ?
                                            <InputError message={hasErrors.cost_by_minute}/> : ""}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 col-span-1 mb-4">
                                    <div className="md:col-span-1 sm:col-span-3">
                                        <InputLabel value="Estanque"/>
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle
                                                    className="items-center cursor-pointer">{pondTitle}</DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getMUDropdownDom()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {(hasErrors?.pond_id) ?
                                            <InputError message={hasErrors.pond_id}/> : ""}
                                    </div>
                                    <div className="md:col-span-1 sm:col-span-3">
                                        <InputLabel value="Tipo de actuador"/>
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle
                                                    className="items-center cursor-pointer">{actuatorTypeTitle}</DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getActuatorTypeDom()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {(hasErrors?.actuator_type_id) ?
                                            <InputError message={hasErrors.actuator_type_id}/> : ""}
                                    </div>
                                    <div className="md:col-span-1 sm:col-span-3">
                                        <InputLabel value="MQTT ID"/>
                                        <TextInput
                                            type="text"
                                            className="w-full"
                                            placeholder=""
                                            name="mqtt_id"
                                            value={data.mqtt_id}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.mqtt_id) ?
                                            <InputError message={hasErrors.mqtt_id}/> : ""}
                                    </div>
                                </div>
                                <div>
                                    <div className="w-full">
                                        <InputLabel value="Descripción"/>
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
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <Link href={goBackRoute}>
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
