import {Link, router, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import {useEffect, useState, useRef} from "react";
import Swal from "sweetalert2";

export default function CreateStep({ auth, step, onClose=() => {} }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;

    const { data, setData, post, patch, reset, processing } = useForm({
        name: '',
    });

    useEffect(() => {
        if(step?.id){
            setStepData(step);
        }
    }, [])

    const setStepData = (step) => {
        setData({
            name: step.name
        });
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(step?.id){
            patch(route('step.update', {stepId: step.id}), {
                onSuccess: () => onSuccessSubmit()
            });
        }
        else {
            post(route('step.store'), {
                onSuccess: () => onSuccessSubmit(),
            });
        }
    }

    const onSuccessSubmit = () => {
        let action = (step?.id) ? "modificada" : "agregada";
        Swal.fire({
            title: "Exito",
            text: "Etapa " + action + " exitosamente",
            icon: "success",
            confirmButtonText: "Continuar",
        }).then((result) => {
            if (result.isConfirmed) {
                onClose();
                router.reload();
            }
        });

    }

    return (<div className="p-5">
                <p className="font-bold text-lg">{(step?.id) ? "Modificar" : "Agregar"} etapa</p>
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto">
                        <div class="bg-white shadow-sm sm:rounded-lg">
                            <div className="grid gap-4 mb-4">
                                <div className="w-full md:col-span-1 sm:col-span-3 my-4">
                                    <InputLabel value="Nombre de la etapa"/>
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

                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <PrimaryButton type="reset" onClick={() => {onClose()}} className="gray bg-gray-800">Cancelar</PrimaryButton>
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
    );
}
