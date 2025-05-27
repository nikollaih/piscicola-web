import { useForm, usePage, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";

export default function ConfigVariable({ formActionUrl, formActionDeleteUrl, automation, onSuccess, steps }) {
    console.log(automation)
    const { errors } = usePage().props;
    const buttonResetRef = useRef(null);
    const [variableTitle, setVariableTitle] = useState('Seleccionar');

    const form = useForm({
        min_value: "",
        max_value: "",
        action: "min",
        variable_key: "",
        automationType: "variable"
    });

    const deleteForm = useForm({ valor: "off" });

    useEffect(() => {
        if (automation?.id) {
            form.setData({
                ...form.data,
                min_value: automation.min_value,
                max_value: automation.max_value,
                variable_key: automation.variable_key,
                action: automation.action
            });

            const selectedStep = steps.find((s) => s.key === automation.variable_key);
            if(selectedStep){
                setVariableTitle(selectedStep.name);
            }
        }
    }, [automation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(formActionUrl, {
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    const handleDelete = () => {
        router.post(formActionDeleteUrl, {
            ...deleteForm.data,
            automationType: 'variable'
        }, {
            onSuccess: () => {
                onSuccess();
                deleteForm.reset();
                buttonResetRef.current.click();
            },
        });
    };

    const setSelectedVariable = (variable) => {
        setVariableTitle(variable.name);
        form.setData({...form.data, variable_key: variable.key});
    }

    const getVariableDropdownDom = () => {
        return steps.map((item) => {
            return <DropDownItem key={item.key} onClick={() => {setSelectedVariable(item)}}>{item.name}</DropDownItem>
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-sm rounded-lg p-5">
                <h4 className="font-semibold">Automatización por variable</h4>
                <p className="mb-4">Encienda el actuador cuando el valor de una variable salga del rango seleccionado y
                    se apaga al llegar al valor indicado.</p>
                <div className="md:col-span-2 sm:col-span-4 mb-2">
                    <InputLabel value="Variable"/>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <DropDownToggle
                                className="items-center cursor-pointer">{variableTitle}</DropDownToggle>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="left" className="px-2" width={100}>
                            {getVariableDropdownDom()}
                        </Dropdown.Content>
                    </Dropdown>
                    {(errors?.variable_key) ?
                        <InputError message={errors.variable_key}/> : ""}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="w-full">
                        <InputLabel value="Valor minimo"/>
                        <TextInput type="number" name="min_value" className="w-full" value={form.data.min_value}
                                   required
                                   onChange={(e) => form.setData('min_value', e.target.value)}/>
                        <InputError message={errors.min_value}/>
                    </div>
                    <div>
                        <InputLabel value="Valor maximo"/>
                        <TextInput type="number" name="max_value" className="w-full" value={form.data.max_value}
                                   required
                                   onChange={(e) => form.setData('max_value', e.target.value)}/>
                        <InputError message={errors.max_value}/>
                    </div>

                </div>
                <div>
                    <InputLabel value="Accion"/>
                    <TextInput type="radio" name="action" className="w-4" value="min"
                               required
                               checked={form.data.action === 'min'}
                               onChange={(e) => form.setData('action', e.target.value)}/> Encender cuando este por debajo del valor minimo y apagar al llegar al valor maximo <br/>
                    <TextInput type="radio" name="action" className="w-4" value="max"
                               required
                               checked={form.data.action === 'max'}
                               onChange={(e) => form.setData('action', e.target.value)}/> Encender cuando este por encima del valor maximo y apagar al llegar al valor minimo
                    <InputError message={errors.action}/>
                </div>
                <div className="flex gap-4 justify-end mt-4">
                    {automation?.id && (
                        <PrimaryButton type="button" className="bg-red-500" onClick={handleDelete}>
                            Eliminar configuración
                        </PrimaryButton>
                    )}
                    <PrimaryButton className="bg-orange-600">Guardar</PrimaryButton>
                    <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                </div>
            </div>
        </form>
    );
}
