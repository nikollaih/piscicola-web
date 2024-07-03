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

export default function StepStatCreate({ auth, steps, stepId, step_stat}) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        step_id: null,
        name: "",
        key: "",
        value_minimun: "",
        value_maximun: ""
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [stepTitle, setStepTitle] = useState('Seleccionar');

    useEffect(() => {
        if(stepId && !step_stat?.id) {
            setInitialStep(stepId);
        }

        if(step_stat?.id){
            setstepStatData(pageProps.step_stat);
        }
    }, [])

    const setInitialStep = (stepId) => {
        let stepTitle = steps.filter((step) => step.id == stepId)[0].name;
        setData({...data, step_id: stepId});
        setStepTitle(stepTitle);
    }

    const setstepStatData = (step_stat) => {
        setData({
            step_id: step_stat.step_id,
            name: step_stat.name,
            key: step_stat.key,
            value_minimun: step_stat.value_minimun,
            value_maximun: step_stat.value_maximun
        });

        setStepTitle(step_stat.step.name)
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(step_stat?.id){
            patch(route('step_stat.update', {stepStatId: step_stat.id}), {
                onSuccess: () => onSuccessSubmit()
            });
        }
        else {
            post(route('step_stat.store'), {
                onSuccess: () => onSuccessSubmit(),
            });
        }
    }

    const onSuccessSubmit = () => {
        let successAction = "modificado";
        if(!step_stat?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the step_stat
        setSuccessMessage('El parámetro fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getStepDropdownDom = () => {
        return steps.map((item) => {
            return <DropDownItem onClick={() => {setSelectedStep(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedStep = (step) => {
        setStepTitle(step.name);
        setData({...data, step_id: step.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(step_stat?.id) ? "Modificar" : "Agregar"} parámetro</h2>}
        >
            <Head title="Parámetro" />
            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div class="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="md:col-span-1 sm:col-span-3">
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
                                    {(hasErrors?.step_id) ?
                                        <InputError message={hasErrors.step_id}/> : ""}
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
                                    <InputLabel value="Key"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        placeholder=""
                                        name="key"
                                        value={data.key}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.key) ?
                                        <InputError message={hasErrors.key}/> : ""}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-2">
                                    <InputLabel value="Valor minimo"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="value_minimun"
                                        value={data.value_minimun}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.value_minimun) ?
                                        <InputError message={hasErrors.value_minimun}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-2">
                                    <InputLabel value="Valor maximo"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="value_maximun"
                                        value={data.value_maximun}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.value_maximun) ?
                                        <InputError message={hasErrors.value_maximun}/> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <Link href={route('step_stats', {stepId: stepId})}>
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
