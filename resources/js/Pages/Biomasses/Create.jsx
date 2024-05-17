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

export default function CreateBiomasse({ auth, sowingId, biomassesUrl }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        sowing_id: sowingId,
        quantity_of_fish: null,
        approximate_weight: null,
        approximate_height: null,
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if(pageProps?.biomasse?.id){
            setSowingData(pageProps.biomasse);
        }
    }, [])

    const setSowingData = (biomasse) => {
        setData({
            sowing_id: biomasse.sowing_id,
            quantity_of_fish: biomasse.quantity_of_fish,
            approximate_weight: biomasse.approximate_weight,
            approximate_height: biomasse.approximate_height,
            manual_created_at: moment(biomasse.manual_created_at).format(Constants.DATEFORMAT)
        });

    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.biomasse?.id){
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
        if(!pageProps?.biomasse?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the biomasse
        setSuccessMessage('La biomasa fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.biomasse?.id) ? "Modificar" : "Agregar"} biomasa</h2>}
        >
            <Head title="Biomasa" />
            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm sm:rounded-lg p-5">
                            <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Peso aproximado (gr)"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="approximate_weight"
                                        value={data.approximate_weight}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.approximate_weight) ?
                                        <InputError message={hasErrors.approximate_weight}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Tamaño aproximado (cm)"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="approximate_height"
                                        value={data.approximate_height}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.approximate_height) ?
                                        <InputError message={hasErrors.approximate_weight}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Cantidad de peces para la muestra"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="quantity_of_fish"
                                        value={data.quantity_of_fish}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.quantity_of_fish) ?
                                        <InputError message={hasErrors.quantity_of_fish}/> : ""}
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
                            <Link href={biomassesUrl}>
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
