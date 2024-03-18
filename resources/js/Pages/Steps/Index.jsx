import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import Modal from "@/Components/Modal.jsx";
import StepItem from "@/Pages/Steps/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import CreateStep from "@/Pages/Steps/Partials/Add.jsx";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Steps({ auth, steps, csrfToken }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedStep, setSelectedStep] = useState({});

    const getStepsDom = () => {
        return steps.map((step) => {
            return <StepItem step={step} onEdit={(step) => {onEdit(step)}} onDelete={(step) => {confirmDeleteStep(step)}}/>
        })
    }

    const confirmDeleteStep = (step) => {
        const {name, id} = step;

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la etapa "${name}"?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteStep(id);
            }
        });
    };

    const deleteStep = async (stepId) => {
        try {
            // Send a request to delete the expense
            const response = await deleteService(route('step.delete', {stepId}), csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // Show a success message to the expense
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success",
                    confirmButtonText: "Continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.reload();
                    }
                });
            } else {
                // If deletion failed, show an error message to the expense
                throw new Error(jsonResponse.msg || 'Failed to delete step.');
            }
        } catch (error) {
            // Handle any errors
            Swal.fire({
                title: "Error",
                text: error.message || 'An unexpected error occurred.',
                icon: "error"
            });
        }
    };

    const onEdit = (step) => {
        setSelectedStep(step);
        setShowAddModal(true);
    }

    const onClose = () => {
        setSelectedStep({});
        setShowAddModal(false);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Etapas</h2>}
        >
            <Head title="Etapas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-end">
                        <PrimaryButton onClick={() => {setShowAddModal(true)}} className="bg-orange-600 h-10">
                            Agregar
                        </PrimaryButton>
                    </div>
                    <div className="grid grid-cols-4 border border-dashed border-gray-200 rounded-lg gap-4 p-1">
                        {getStepsDom()}
                    </div>
                </div>
            </div>
            <Modal show={showAddModal} onClose={() => {onClose()}}>
                <CreateStep onClose={() => {onClose()}} step={selectedStep}/>
            </Modal>
        </AuthenticatedLayout>
    )
        ;
}
