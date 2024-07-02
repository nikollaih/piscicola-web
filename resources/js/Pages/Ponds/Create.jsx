import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import {useEffect, useState, useRef} from "react";
import moment from "moment";
import Constants from "@/../Constants.js";
import Checkbox from "@/Components/Checkbox.jsx";

export default function CreatePond({ auth }) {

    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const [successMessage, setSuccessMessage] = useState('');
    const { data, setData, post, patch, reset, processing } = useForm({
        name: "",
        area: "",
        volume: "",
        entrance: "",
        exit: "",
        covered: 0,
        mqtt_id: ''
    });

    useEffect(() => {
        if(pageProps?.pond?.id){
            setPondData(pageProps.pond);
        }
    }, [])

    const setPondData = (pond) => {
        setData({
            name: pond.name,
            area: pond.area,
            volume: pond.volume,
            entrance: pond.entrance,
            exit: pond.exit,
            covered: pond.covered,
            mqtt_id: pond.mqtt_id
        });

    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.pond?.id){
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
        if(!pageProps?.pond?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the pond
        setSuccessMessage('El estanque fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.pond?.id) ? "Modificar" : "Agregar"} estanque</h2>}
        >
            <Head title="Estanque" />
            <div className="py-4 lg:py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm sm:rounded-lg p-5">
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Nombre del estanque"/>
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
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Área (mt2)"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="area"
                                        value={data.area}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.area) ?
                                        <InputError message={hasErrors.area}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Volumen"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="volume"
                                        value={data.volume}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.volume) ?
                                        <InputError message={hasErrors.volume}/> : ""}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Caudal de entrada (L/s)"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="entrance"
                                        value={data.entrance}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.entrance) ?
                                        <InputError message={hasErrors.entrance}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Caudal de salida (L/s)"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="exit"
                                        value={data.exit}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.exit) ?
                                        <InputError message={hasErrors.exit}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
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
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Cubierto"/>
                                    <Checkbox
                                        name="covered"
                                        checked={(data.covered === 1)}
                                        style={{height: 41, width: 41}}
                                        className="cursor-pointer"
                                        onChange={(e) => setData(e.target.name, (e.target.checked) ? 1 : 0)}/>
                                    {(hasErrors?.covered) ?
                                        <InputError message={hasErrors.covered}/> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <Link className="w-full sm:w-auto" href={route('ponds')}>
                                <PrimaryButton className="gray bg-gray-800 w-full sm:w-auto">Regresar</PrimaryButton>
                            </Link>
                            <PrimaryButton
                                className="bg-orange-600 w-full sm:w-auto"
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
