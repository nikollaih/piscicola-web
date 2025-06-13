import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Constants from "@/../Constants.js";
import Checkbox from "@/Components/Checkbox.jsx";

export default function CreatePond({ auth }) {
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
        mqtt_id: '',
        sensor_id: ''
    });

    useEffect(() => {
        if (pageProps?.pond?.id) {
            setPondData(pageProps.pond);
        }
    }, []);

    const setPondData = (pond) => {
        setData({
            name: pond.name,
            area: pond.area,
            volume: pond.volume,
            entrance: pond.entrance,
            exit: pond.exit,
            covered: pond.covered,
            mqtt_id: pond.mqtt_id,
            sensor_id: pond.sensor_id
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pageProps?.pond?.id) {
            patch(pageProps.formActionUrl, { onSuccess: () => onSuccessSubmit() });
        } else {
            post(pageProps.formActionUrl, { onSuccess: () => onSuccessSubmit() });
        }
    };

    const onSuccessSubmit = () => {
        let successAction = pageProps?.pond?.id ? "modificado" : "agregado";
        if (!pageProps?.pond?.id) reset();
        setSuccessMessage(`El estanque fue ${successAction} satisfactoriamente`);
        buttonResetRef.current.click();
    };

    const handleDelete = () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este estanque?")) {
            router.delete(route('pond.delete', { pondId: pageProps.pond.id }));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Estanque" />
            <div className="py-4 lg:py-12">
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
                                        <Link href="/ponds" className="hover:text-gray-700">Infraestructura</Link>
                                        <span className="mx-2">{'>'}</span>
                                        <span className="text-gray-700">Estanques</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {pageProps?.pond?.id ? "Modificar" : "Nuevo"} Estanque
                                    </h2>
                                </div>
                            </div>
                            <Link href={route('ponds')}>
                                <PrimaryButton className="bg-gray-800">Regresar</PrimaryButton>
                            </Link>
                        </div>

                        <br/>

                        <div className="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
                                {/* Columna Izquierda */}
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <InputLabel value="Nombre del estanque"/>
                                        <TextInput
                                            type="text"
                                            className="w-full h-9 text-sm"
                                            name="name"
                                            value={data.name}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.name && <InputError message={hasErrors.name}/>}
                                    </div>
                                    <div>
                                        <InputLabel value="Área (mt2)"/>
                                        <TextInput
                                            type="number"
                                            className="w-full h-9 text-sm"
                                            name="area"
                                            value={data.area}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.area && <InputError message={hasErrors.area}/>}
                                    </div>
                                    <div>
                                        <InputLabel value="Volumen"/>
                                        <TextInput
                                            type="number"
                                            className="w-full h-9 text-sm"
                                            name="volume"
                                            value={data.volume}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.volume && <InputError message={hasErrors.volume}/>}
                                    </div>
                                    <div>
                                        <InputLabel value="Caudal de entrada (L/s)"/>
                                        <TextInput
                                            type="number"
                                            className="w-full h-9 text-sm"
                                            name="entrance"
                                            value={data.entrance}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.entrance && <InputError message={hasErrors.entrance}/>}
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <InputLabel value="Caudal de salida (L/s)"/>
                                        <TextInput
                                            type="number"
                                            className="w-full h-9 text-sm"
                                            name="exit"
                                            value={data.exit}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.exit && <InputError message={hasErrors.exit}/>}
                                    </div>
                                    <div>
                                        <InputLabel value="MQTT ID"/>
                                        <TextInput
                                            type="text"
                                            className="w-full h-9 text-sm"
                                            name="mqtt_id"
                                            value={data.mqtt_id}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.mqtt_id && <InputError message={hasErrors.mqtt_id}/>}
                                    </div>
                                    <div>
                                        <InputLabel value="Sensor ID"/>
                                        <TextInput
                                            type="text"
                                            className="w-full h-9 text-sm"
                                            name="sensor_id"
                                            value={data.sensor_id}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.sensor_id && <InputError message={hasErrors.sensor_id}/>}
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <InputLabel value="Cubierto"/>
                                        <Checkbox
                                            name="covered"
                                            checked={data.covered === 1}
                                            style={{height: 20, width: 20}}
                                            className="cursor-pointer"
                                            onChange={(e) => setData(e.target.name, e.target.checked ? 1 : 0)}
                                        />
                                        {hasErrors?.covered && <InputError message={hasErrors.covered}/>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-4">
                            <PrimaryButton
                                className="bg-orange-600 w-full sm:w-auto text-white"
                                disabled={processing}
                            >
                                Guardar
                            </PrimaryButton>
                            <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                        </div>

                        {/* Sección de eliminación (solo si es edición) */}
                        {pageProps?.pond?.id && (
                            <div className="bg-white shadow-sm rounded-lg p-5 mt-6 border border-gray-300">
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">Eliminación</h2>
                                <p className="mb-4 text-gray-600">
                                    Se eliminará permanentemente el estanque “
                                    <strong>{pageProps.pond.name}</strong>”. Verifica que sea la acción que quieres
                                    realizar.
                                </p>
                                <PrimaryButton
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Eliminar estanque
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
