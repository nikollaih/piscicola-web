import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx';
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Constants from "../../../../Constants.js";
import AlertMessage from "@/Components/AlertMessage.jsx";

export const  ManualReading = ({ stepStats = [] = [], sowing }) => {
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;

    const { data, setData, post, reset, processing, setError, errors } = useForm({
        step_stat_id: null,
        step_id: sowing?.step_id,
        sowing_id: sowing?.id,
        value: null,
        topic_time: moment().format(Constants.DATETIME_INPUT_FORMAT),
    });

    const [stepStatTitle, setStepStatTitle] = useState('Seleccionar');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        return () => {
            location.reload();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(data?.step_stat_id){
            post(route('manual.reading.create'), {
                onSuccess: () => onSuccessSubmit(),
            });
        }
        else {
            setError('step_stat_id', 'Por favor selecciona una variable de lectura');
        }

    };

    const onSuccessSubmit = () => {
        setSuccessMessage('La lectura fue agregada satisfactoriamente');
        setStepStatTitle('Seleccionar');
        reset();
        buttonResetRef.current.click();
    };

    const setSelectedStepStat = (stepStat) => {
        setData({ ...data, step_stat_id: stepStat.id });
        setStepStatTitle(stepStat.name);
    };

    const getStepStatsDropdownDom = () => {
        return stepStats.data.map((stepStat) => (
            <DropDownItem key={stepStat.id} onClick={() => { setSelectedStepStat(stepStat) }}>{stepStat.name}</DropDownItem>
        ));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                <AlertMessage
                    title={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                        <div className="w-full md:col-span-1">
                            <InputLabel value="Variable de lectura"/>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <DropDownToggle
                                        className="items-center cursor-pointer">{stepStatTitle}</DropDownToggle>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="left" className="px-2" width={100}>
                                    {getStepStatsDropdownDom()}
                                </Dropdown.Content>
                            </Dropdown>
                            {(hasErrors?.step_stat_id || errors?.step_stat_id) && <InputError message={hasErrors?.step_stat_id ?? errors?.step_stat_id}/>}
                        </div>

                        <div className="w-full md:col-span-1">
                            <InputLabel value="Valor de lectura"/>
                            <TextInput
                                type="number"
                                className="w-full"
                                name="value"
                                placeholder={0}
                                value={data.value}
                                required
                                onChange={(e) => setData(e.target.name, e.target.value)}
                            />
                            {hasErrors?.value && <InputError message={hasErrors.value}/>}
                        </div>

                        <div className="w-full md:col-span-1">
                            <InputLabel value="Fecha y hora de lectura"/>
                            <TextInput
                                type="datetime-local"
                                className="w-full"
                                name="topic_time"
                                value={data.topic_time}
                                required
                                onChange={(e) => setData(e.target.name, e.target.value)}
                            />
                            {hasErrors?.topic_time && <InputError message={hasErrors.topic_time}/>}
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
        </form>
    );
}
