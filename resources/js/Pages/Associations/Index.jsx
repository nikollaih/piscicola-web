import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import AssociationItem from "@/Pages/Associations/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Associations({ auth, associations }) {
    let usePages = usePage();

    useEffect(() => {
    }, [])

    /**
     * Prompt the user to confirm deletion of a user.
     *
     * @param {Object} user - The user object to be deleted.
     * @returns {void}
     */
    const confirmDeleteAssociation = (association) => {
        const { name, id } = association; // Destructure user object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la asociación "${name}"?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAssociation(id);
            }
        });
    };

    /**
     * Delete a user asynchronously.
     *
     * @param {number} userId - The ID of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the user is deleted.
     */
    const deleteAssociation = async (associationId) => {
        try {
            // Send a request to delete the user
            const response = await deleteService(route('association.delete', {associationId}), usePages.props.csrfToken);

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

    const getAssociationsDom = () => {
        return associations.data.map((association) => {
            return <AssociationItem association={association} onDelete={confirmDeleteAssociation}/>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Asociaciones</h2>}
        >
            <Head title="Asociaciones" />
            <div className="py-4 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-end">
                        <Link href={route('association.create')}>
                            <PrimaryButton className="bg-orange-600 h-10">
                                Agregar
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 border border-dashed border-gray-200 rounded-lg gap-4 p-1">
                        {getAssociationsDom()}
                    </div>
                    <Pagination class="mt-6" links={associations.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
