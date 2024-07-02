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
import Constants from "../../../Constants.js";

export default function CreateSowing({ auth, fish, steps, ponds, sowing }) {
    // Create a ref for the reset button
    const goBackRoute = (sowing?.id) ? route('sowing.view', {sowingId: sowing.id}) : route('sowings');
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;
    const { data, setData, post, patch, reset, processing } = useForm({
        step_id: null,
        fish_id: null,
        pond_id: null,
        quantity: null,
        manual_created_at: moment().format(Constants.DATEFORMAT),
        name: ""
    });

    const [fishTitle, setFishTitle] = useState('Seleccionar');
    const [stepTitle, setStepTitle] = useState('Seleccionar');
    const [pondTitle, setPondTitle] = useState('Seleccionar');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if(pageProps?.sowing?.id){
            setSowingData(pageProps.sowing);
        }
    }, [])

    const setSowingData = (sowing) => {
        setData({
            fish_id: sowing.fish_id,
            step_id: sowing.step_id,
            pond_id: sowing.pond_id,
            quantity: sowing.quantity,
            name: sowing.name,
            manual_created_at: moment(sowing.manual_created_at).format(Constants.DATEFORMAT),
        });

        setFishTitle(fish.filter((r) => r.id === sowing.fish_id).at(0).name);
        setStepTitle(steps.filter((r) => r.id === sowing.step_id).at(0).name);
        setPondTitle(ponds.filter((r) => r.id === sowing.pond_id).at(0).name);
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.sowing?.id){
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
        if(!pageProps?.sowing?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the sowing
        setSuccessMessage('La cosecha fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }


    const setSelectedFish = (fish) => {
        setData({...data, fish_id: fish.id});
        setFishTitle(fish.name);
    }

    const setSelectedStep = (step) => {
        setData({...data, step_id: step.id});
        setStepTitle(step.name);
    }

    const setSelectedPond = (pond) => {
        setData({...data, pond_id: pond.id});
        setPondTitle(pond.name);
    }

    const getFishDropdownDom = () => {
        return fish.map((fish) => {
            return <DropDownItem onClick={() => {setSelectedFish(fish)}}>{fish.name}</DropDownItem>
        })
    }

    const getStepDropdownDom = () => {
        return steps.map((step) => {
            return <DropDownItem onClick={() => {setSelectedStep(step)}}>{step.name}</DropDownItem>
        })
    }

    const getPondDropdownDom = () => {
        return ponds.map((pond) => {
            return <DropDownItem onClick={() => {setSelectedPond(pond)}}>{pond.name}</DropDownItem>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.sowing?.id) ? "Modificar" : "Agregar"} cosecha</h2>}
        >
            <Head title="Cosecha" />
            <div className="py-4 sm:py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Nombre"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        placeholder=""
                                        name="name"
                                        value={data.name}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.name) ? <InputError message={hasErrors.name}/> : ""}
                                </div>
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Producto"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{fishTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getFishDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.fish_id) ? <InputError message={hasErrors.fish_id}/> : ""}
                                </div>
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Etapa"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{stepTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getStepDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.step_id) ? <InputError message={hasErrors.step_id}/> : ""}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Estanque"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{pondTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getPondDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.pond_id) ? <InputError message={hasErrors.pond_id}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Fecha de siembra"/>
                                    <TextInput
                                        type="date"
                                        className="w-full"
                                        placeholder=""
                                        name="manual_created_at"
                                        value={data.manual_created_at}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.manual_created_at) ? <InputError message={hasErrors.manual_created_at}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Cantidad de peces"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="quantity"
                                        value={data.quantity}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.quantity) ? <InputError message={hasErrors.quantity}/> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <Link className="w-full sm:w-auto" href={goBackRoute}>
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
