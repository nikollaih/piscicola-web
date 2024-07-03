import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {useEffect, useState} from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import {deleteService} from "@/Services/Services.ts";
import LinearChart from "@/Components/LinearChart.jsx";
import moment from "moment";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Expenses({ auth, sowing, expenses }) {
    let usePages = usePage();
console.log(usePages.props.createExpenseUrl)
    /**
     * Prompt the expense to confirm deletion of a expense.
     *
     * @param {Object} expenseId - The expense id to be deleted.
     * @returns {void}
     */
    const confirmDeleteExpense = (expenseId) => {

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el gasto?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteExpense(expenseId);
            }
        });
    };

    /**
     * Delete a expense asynchronously.
     *
     * @param {number} expenseId - The ID of the expense to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the expense is deleted.
     */
    const deleteExpense = async (expenseId) => {
        try {
            // Send a request to delete the expense
            const response = await deleteService(route('expense.delete', {expenseId}), usePages.props.csrfToken);

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
                throw new Error(jsonResponse.msg || 'Failed to delete expense.');
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
                        {(sowing?.id) ? ("Gastos de la cosecha: " + sowing.name) : "Gastos" }
                    </h2>
                </div>
            }
        >
            <Head title="Gastos"/>
            <div className="py-4 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex gap-4 justify-end mb-4">
                        <Link href={usePages.props.createExpenseUrl}>
                            <PrimaryButton className="bg-orange-600">Agregar Gasto</PrimaryButton>
                        </Link>
                    </div>

                    <div className="grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="col-span-1 rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-1 grid grid-cols-1 bg-white">
                            <p className="px-4 pt-2 mb-4 font-bold text-lg">Gastos del último mes</p>
                            <LinearChart readings={usePages.props.latestExpenses}  value="cost" date="manual_created_at" chartId="expenses"/>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white shadow-sm rounded-lg py-5 overflow-x-auto">
                            <table id="table-expenses" className="w-full table table-auto">
                                <thead className="text-gray-900 font-bold">
                                    <td className="pl-5 pr-20">Costo</td>
                                    <td className="pr-20">Categoria</td>
                                    <td className="pr-20 min-w-[250px]">Concepto</td>
                                    <td className="pr-20">Notas</td>
                                    <td className="pr-20">Fecha</td>
                                    <td></td>
                                </thead>
                                <tbody>
                                {expenses.data.map((expense) => (
                                    <tr key={expense.id} id={expense.id}
                                        className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden w-full">
                                        <td className="font-bold pl-5 pr-4">${expense.cost.toLocaleString('es-CO')}</td>
                                        <td>{expense.category.name}</td>
                                        <td>{expense.concept}</td>
                                        <td>{expense.notes}</td>
                                        <td>{moment(expense.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            <div className="flex gap-2 pr-4">
                                                <Link
                                                    href={route('expense.edit', {expenseId: expense.id, sowingId: sowing?.id})}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         strokeWidth={1} stroke="currentColor"
                                                         className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Link>
                                                <svg onClick={() => {
                                                    confirmDeleteExpense(expense.id)
                                                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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
                        <Pagination class="mt-6" links={expenses.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
