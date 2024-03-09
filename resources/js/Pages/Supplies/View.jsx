import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {useEffect, useState} from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import {deleteService} from "@/Services/Services.ts";
import moment from "moment";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function SupplyView({ auth, supply, supplyPurchases }) {
    let usePages = usePage();

    /**
     * Prompt the user to confirm deletion of a supply.
     *
     * @param {Object} supply - The supply object to be deleted.
     * @returns {void}
     */
    const confirmDeleteSupplyPurchase = (supplyId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la compra?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSupplyPurchase(supplyId);
            }
        });
    };

    /**
     * Delete a supply asynchronously.
     *
     * @param {number} supplyId - The ID of the supply to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the supply is deleted.
     */
    const deleteSupplyPurchase = async (supplyId) => {
        try {
            // Send a request to delete the supply
            const response = await deleteService(route('supply_purchase.delete', {supplyPurchaseId: supplyId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // If successful, update the supply list
                router.reload();

                // Show a success message to the user
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete supply.');
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {supply.name}
                    </h2>
                </div>
            }
        >
            <Head title={supply.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex gap-4 justify-end mb-4">
                        <Link href={route('supply_purchase.create', {supplyId: supply.id})}>
                            <PrimaryButton className="bg-orange-600">Nueva compra</PrimaryButton>
                        </Link>
                        <Link href={route('supply.edit', {supplyId: supply.id})}>
                            <PrimaryButton className="bg-blue-600">Modificar suministro</PrimaryButton>
                        </Link>
                        <PrimaryButton onClick={() => {confirmDeleteSupplyPurchase(supply.id)}} className="bg-red-600">Eliminar suministro</PrimaryButton>
                    </div>

                    <div className="md:grid-cols-3 sm:grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="bg-white overflow-hidden sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-1 w-full">
                            <div className="p-3 rounded-md">
                                <div className="mb-3">
                                    <p className="text-gray-600">Producto</p>
                                    <p className="font-semibold">{supply.name}</p>
                                </div>
                                <div className="mb-3">
                                    <p className="text-gray-600">Uso</p>
                                    <p className="font-semibold">{Constants.SUPPLIES_USES_TYPES[supply.use_type]}</p>
                                </div>
                                <div className="mb-3">
                                    <p className="text-gray-600">Cantidad disponible</p>
                                    <p className="font-semibold">{supply.available_quantity}{supply.measurement_unit.name}</p>
                                </div>
                                <div className="">
                                    <p className="text-gray-600">Notas</p>
                                    <p className="font-semibold">{supply.notes}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className=" sm:rounded-lg p-4 shadow-md sm:col-span-1 md:col-span-2 bg-white">
                            <p className="font-bold text-lg">Compras</p>
                            <p className="mb-4">Historial de compras del suministro.</p>
                            <table id="table-supplyPurchases" className="w-full table table-auto bg-gray-50 rounded-md">
                                <thead className="text-gray-900 font-bold">
                                    <td className="pl-5 py-2">Cantidad</td>
                                    <td>Precio</td>
                                    <td>Fecha de compra</td>
                                    <td></td>
                                </thead>
                                <tbody>
                                {supplyPurchases.data.map((supply) => (
                                    <tr key={supply.id} id={supply.id}
                                        className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                        <td className="font-bold pl-5">{supply.quantity}{supply.measurement_unit_name}</td>
                                        <td className=" pr-2">${supply.price.toLocaleString('es-CO')}</td>
                                        <td className="pr-2">{moment(supply.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('supply_purchase.edit', { supplyPurchaseId: supply.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         strokeWidth={1} stroke="currentColor"
                                                         className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Link>
                                                <svg onClick={() => {
                                                    confirmDeleteSupplyPurchase(supply.id)
                                                }} xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24"
                                                     stroke-width="1" stroke="currentColor"
                                                     className="w-5 h-5 text-red-600">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
