import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import ProductiveUnitItem from "@/Pages/ProductiveUnits/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function ProductiveUnits({ auth, associations }) {
    let usePages = usePage();

    useEffect(() => {
    }, [])

    /**
     * Prompt the user to confirm deletion of a user.
     *
     * @param {Object} user - The user object to be deleted.
     * @returns {void}
     */
    const confirmDeleteProductiveUnit = (association) => {
        const { name, id } = association; // Destructure user object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la unidad productiva "${name}"?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProductiveUnit(id);
            }
        });
    };

    /**
     * Delete a user asynchronously.
     *
     * @param {number} userId - The ID of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the user is deleted.
     */
    const deleteProductiveUnit = async (productiveUnitId) => {
        try {
            // Send a request to delete the user
            const response = await deleteService(route('productive_unit.delete', {productiveUnitId}), usePages.props.csrfToken);

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
            return <div className="mb-6">
                <p className="text-xl mb-2 font-bold">{association.name}</p>
                <div className="grid grid-cols-4 border border-dashed border-gray-200 rounded-lg gap-4 p-1">
                    {getProductiveUnitsDom(association.productive_units)}
                </div>
            </div>
        })

    }

    const getProductiveUnitsDom = (productive_units) => {
        return productive_units.map((pu) => {
            return <ProductiveUnitItem productiveUnit={pu} onDelete={confirmDeleteProductiveUnit}/>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Unidades productivas</h2>}
        >
            <Head title="Unidades productivas" />
            <div className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-end">
                        <Link href={route('productive_unit.create')}>
                            <PrimaryButton className="bg-orange-600 h-10">
                                Agregar
                            </PrimaryButton>
                        </Link>
                    </div>
                    {
                        getAssociationsDom()
                    }
                    <Pagination class="mt-6" links={associations.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
