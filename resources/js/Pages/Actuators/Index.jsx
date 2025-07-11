import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import ActuatorItem from "@/Pages/Actuators/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Actuators({ auth, actuators }) {
    let usePages = usePage();

    useEffect(() => {
    }, [])

    /**
     * Prompt the user to confirm deletion of a user.
     *
     * @param {Object} user - The user object to be deleted.
     * @returns {void}
     */
    const confirmDeleteActuator = (actuator) => {
        const { name, id } = actuator; // Destructure user object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el actuador "${name}"?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteActuator(id);
            }
        });
    };

    /**
     * Delete a user asynchronously.
     *
     * @param {number} userId - The ID of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the user is deleted.
     */
    const deleteActuator = async (actuatorId) => {
        try {
            // Send a request to delete the user
            const response = await deleteService(route('actuator.delete', {actuatorId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // Show a success message to the biomasse
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success",
                    confirmButtonText: "Continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.reload()
                    }
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete user.');
            }
        } catch (error) {
            // Handle any errors
            Swal.fire({
                title: "Error",
                text: error,
                icon: "error"
            });
        }
    };

    const getActuatorsDom = () => {
        return actuators.data.map((actuator) => {
            return <ActuatorItem actuator={actuator} onDelete={confirmDeleteActuator}/>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Actuadores" />
            <div className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="">
                        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Infraestructura</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Actuadores
                                </h2>
                            </div>
                            <div className="flex justify-end">
                                <Link href={route('actuator.create')}>
                                    <PrimaryButton className="bg-orange-600 h-10 text-white">
                                        Nuevo Actuador
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-lg gap-4 p-1">
                        {getActuatorsDom()}
                    </div>
                    <Pagination class="mt-6" links={actuators.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
