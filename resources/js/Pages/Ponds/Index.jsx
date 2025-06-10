import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import PondItem from "@/Pages/Ponds/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Ponds({ auth, ponds }) {
    console.log(ponds)
    let usePages = usePage();

    useEffect(() => {
    }, [])

    /**
     * Prompt the user to confirm deletion of a user.
     *
     * @param {Object} user - The user object to be deleted.
     * @returns {void}
     */
    const confirmDeletePond = (pond) => {
        const { name, id } = pond; // Destructure user object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el estanque "${name}"?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deletePond(id);
            }
        });
    };

    /**
     * Delete a user asynchronously.
     *
     * @param {number} userId - The ID of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the user is deleted.
     */
    const deletePond = async (pondId) => {
        try {
            // Send a request to delete the user
            const response = await deleteService(route('pond.delete', {pondId}), usePages.props.csrfToken);

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

    const getPondsDom = () => {
        return ponds.data.map((pond) => {
            return <PondItem pond={pond} onDelete={confirmDeletePond}/>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Estanques</h2>}
        >
            <Head title="Estanques" />
            <div className="py-4 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Infraestructura</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Estanques
                                </h2>
                            </div>
                            <div className="flex mb-4 justify-end">
                                <Link href={route('pond.create')}>
                                    <PrimaryButton className="bg-orange-600 h-10 text-white">
                                        Nuevo estanque
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-lg gap-4 p-1">
                        {getPondsDom()}
                    </div>
                    <Pagination class="mt-6" links={ponds.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
