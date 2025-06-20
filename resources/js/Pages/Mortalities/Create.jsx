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

export default function CreateMortality({ auth, biomasseId, mortalitiesUrl }) {

    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const [successMessage, setSuccessMessage] = useState('');
    const { data, setData, post, patch, reset, processing } = useForm({
        biomasse_id: biomasseId,
        sample_quantity: "",
        dead: "",
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });

    useEffect(() => {
        if(pageProps?.mortality?.id){
            setMortalityData(pageProps.mortality);
        }
    }, [])

    const setMortalityData = (mortality) => {
        setData({
            sample_quantity: mortality.sample_quantity,
            dead: mortality.dead,
            manual_created_at: moment(mortality.manual_created_at).format(Constants.DATEFORMAT)
        });

    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.mortality?.id){
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
        if(!pageProps?.mortality?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the mortality
        setSuccessMessage('La mortalidad fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }



    return (
        <AuthenticatedLayout
            user={auth.user}
            //header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.mortality?.id) ? "Modificar" : "Agregar"} mortalidad</h2>}
        >
            <Head title="Mortalidad" />
            <div className="py-4 sm:py-6">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                <div>
                                    <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                                <Link href="/sowings" className="hover:text-gray-700">Cosecha</Link>
                                                <span className="mx-2">{'>'}</span>
                                                <span className="text-gray-700">Agregar Mortalidad</span>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                Nueva Mortalidad
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link className="w-full sm:w-auto" href={mortalitiesUrl}>
                                <PrimaryButton className="bg-neutral-800">Regresar</PrimaryButton>
                            </Link>
                        </div>
                        <br />
                        <div className="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Cantidad de peces para la muestra"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="sample_quantity"
                                        value={data.sample_quantity}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.sample_quantity) ?
                                        <InputError message={hasErrors.sample_quantity}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Cantidad de peces muertos"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="dead"
                                        value={data.dead}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.dead) ?
                                        <InputError message={hasErrors.dead}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Fecha de la muestra"/>
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
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
