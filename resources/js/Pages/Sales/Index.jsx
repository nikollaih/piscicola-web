import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";
import Constants from "../../../Constants.js";
import moment from "moment";

export default function Sales({ auth, sales }) {
    let usePages = usePage();
    const [salesList, setSalesList] = useState([]);

    useEffect(() => {
        if(salesList.length === 0){
            setSalesList(sales.data)
        }
    }, [])

    /**
     * Prompt the user to confirm deletion of a sale.
     *
     * @param {Object} sale - The sale object to be deleted.
     * @returns {void}
     */
    const confirmDeleteSale = (saleId) => {

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la venta}?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSale(saleId);
            }
        });
    };

    /**
     * Delete a sale asynchronously.
     *
     * @param {number} saleId - The ID of the sale to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the sale is deleted.
     */
    const deleteSale = async (saleId) => {
        try {
            // Send a request to delete the sale
            const response = await deleteService(route('sale.delete', {saleId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // If successful, update the sale list
                const updatedSales = salesList.filter(sale => sale.id !== saleId);
                setSalesList(updatedSales);

                // Show a success message to the user
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete sale.');
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ventas</h2>}
        >
            <Head title="Ventas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-5">
                        <table id="table-sales" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                            <td className="pl-5">Cliente</td>
                            <td>Precio unitario</td>
                            <td>Peso total</td>
                            <td>Precio de venta</td>
                            <td>Fecha</td>
                            <td></td>
                            </thead>
                            <tbody>
                            { salesList.map( (sale) => (
                                <tr key={sale.id} id={sale.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                    <td className="font-bold pl-5"> {sale.client.name.toUpperCase()} </td>
                                    <td className=" pr-2">${sale.unit_cost.toLocaleString('es-CO')}</td>
                                    <td className="pr-2">{sale.total_weight.toLocaleString('es-CO')}</td>
                                    <td className="font-bold text-green-600">${(sale.unit_cost * sale.total_weight).toLocaleString('es-CO')}</td>
                                    <td>{moment(sale.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                    <td className="flex gap-2 py-4">
                                        <Link href={route('sale.edit', {saleId: sale.id})}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1} stroke="currentColor"
                                                 className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                            </svg>
                                        </Link>
                                        <svg onClick={() => {confirmDeleteSale(sale.id)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1" stroke="currentColor"
                                             className="w-5 h-5 text-red-600">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination class="mt-6" links={sales.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
