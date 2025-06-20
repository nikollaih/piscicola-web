import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx';
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Constants from "../../../Constants.js";

export default function CreateSowing({ auth, fish, steps, ponds, sowing }) {
    const goBackRoute = (sowing?.id) ? route('sowing.view', { sowingId: sowing.id }) : route('sowings');
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        step_id: null,
        fish_id: null,
        pond_id: null,
        quantity: null,
        manual_created_at: moment().format(Constants.DATEFORMAT),
        fecha_estimada: "", // ➡️ Nuevo campo
        name: "",
        check_interval: -1
    });

    const [fishTitle, setFishTitle] = useState('Seleccionar');
    const [stepTitle, setStepTitle] = useState('Seleccionar');
    const [pondTitle, setPondTitle] = useState('Seleccionar');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (pageProps?.sowing?.id) {
            setSowingData(pageProps.sowing);
        }
    }, []);

    const setSowingData = (sowing) => {
        setData({
            fish_id: sowing.fish_id,
            step_id: sowing.step_id,
            pond_id: sowing.pond_id,
            quantity: sowing.quantity,
            name: sowing.name,
            check_interval: sowing.check_interval,
            manual_created_at: moment(sowing.manual_created_at).format(Constants.DATEFORMAT),
            fecha_estimada: sowing.fecha_estimada ? moment(sowing.fecha_estimada).format(Constants.DATEFORMAT) : "", // ➡️ Nuevo campo
        });

        setFishTitle(fish.find(r => r.id === sowing.fish_id)?.name || 'Seleccionar');
        setStepTitle(steps.find(r => r.id === sowing.step_id)?.name || 'Seleccionar');
        setPondTitle(ponds.find(r => r.id === sowing.pond_id)?.name || 'Seleccionar');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pageProps?.sowing?.id) {
            patch(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit()
            });
        } else {
            post(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit(),
            });
        }
    };

    const onSuccessSubmit = () => {
        let successAction = "modificada";
        if (!pageProps?.sowing?.id) {
            reset();
            successAction = "agregada";
        }
        setSuccessMessage('La cosecha fue ' + successAction + ' satisfactoriamente');
        buttonResetRef.current.click();
    };

    const setSelectedFish = (fish) => {
        setData({ ...data, fish_id: fish.id });
        setFishTitle(fish.name);
    };

    const setSelectedStep = (step) => {
        setData({ ...data, step_id: step.id });
        setStepTitle(step.name);
    };

    const setSelectedPond = (pond) => {
        setData({ ...data, pond_id: pond.id });
        setPondTitle(pond.name);
    };

    const getFishDropdownDom = () => {
        return fish.map((fish) => (
            <DropDownItem key={fish.id} onClick={() => { setSelectedFish(fish) }}>{fish.name}</DropDownItem>
        ));
    };

    const getStepDropdownDom = () => {
        return steps.map((step) => (
            <DropDownItem key={step.id} onClick={() => { setSelectedStep(step) }}>{step.name}</DropDownItem>
        ));
    };

    const getPondDropdownDom = () => {
        return ponds.map((pond) => (
            <DropDownItem key={pond.id} onClick={() => { setSelectedPond(pond) }}>{pond.name}</DropDownItem>
        ));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cosecha" />
            <div className="py-4 sm:py-6">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4 ">
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <Link href="/sowings" className="hover:text-gray-700">Cosecha</Link>
                                    <span className="mx-2">{'>'}</span>
                                    <span className="text-gray-700">{pageProps?.sowing?.id ? "Modificar" : "Agregar"} Cosecha</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {pageProps?.sowing?.id ? "Modificar" : "Nuevo"} Cosecha
                                </h2>
                            </div>
                            <Link className="w-full sm:w-auto" href={goBackRoute}>
                                <PrimaryButton className={"bg-neutral-800"}>Regresar</PrimaryButton>
                            </Link>
                        </div>

                        <div className="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                                <div className="w-full md:col-span-1">
                                    <InputLabel value="Nombre"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        name="name"
                                        value={data.name}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.name && <InputError message={hasErrors.name}/>}
                                </div>

                                <div className="w-full md:col-span-1">
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
                                    {hasErrors?.fish_id && <InputError message={hasErrors.fish_id}/>}
                                </div>

                                <div className="w-full md:col-span-1">
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
                                    {hasErrors?.step_id && <InputError message={hasErrors.step_id}/>}
                                </div>

                                <div className="w-full md:col-span-1">
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
                                    {hasErrors?.pond_id && <InputError message={hasErrors.pond_id}/>}
                                </div>

                                <div className="w-full md:col-span-1">
                                    <InputLabel value="Fecha de siembra"/>
                                    <TextInput
                                        type="date"
                                        className="w-full"
                                        name="manual_created_at"
                                        value={data.manual_created_at}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.manual_created_at &&
                                        <InputError message={hasErrors.manual_created_at}/>}
                                </div>

                                <div className="w-full md:col-span-1">
                                    <InputLabel value="Cantidad de peces"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        name="quantity"
                                        value={data.quantity}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.quantity && <InputError message={hasErrors.quantity}/>}
                                </div>

                                <div className="w-full md:col-span-1">
                                    <InputLabel value="Fecha estimada de finalización"/>
                                    <TextInput
                                        type="date"
                                        className="w-full"
                                        name="fecha_estimada"
                                        value={data.fecha_estimada}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.fecha_estimada && <InputError message={hasErrors.fecha_estimada}/>}
                                </div>

                                <div className="w-full md:col-span-1">
                                    <InputLabel
                                        value="Minutos de alertas (Se enviara una alerta despues de no recibir lecturas en esta cantidad de minutos)"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        name="check_interval"
                                        value={data.check_interval}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {hasErrors?.check_interval && <InputError message={hasErrors.check_interval}/>}
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
