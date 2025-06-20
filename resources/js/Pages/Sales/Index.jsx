import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from "react";
import { deleteService } from "@/Services/Services.ts";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Pagination from "@/Components/Pagination.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import LinearChart from "@/Components/LinearChart.jsx";
import Constants from "../../../Constants.js";
import moment from "moment";

export default function Sales({ auth, sales }) {
    const usePages = usePage();
    const [salesList, setSalesList] = useState([]);
    const [selectedClientTitle, setSelectedClientTitle] = useState('Seleccionar cliente');
    const [activeSales, setActiveSales] = useState([]);

    useEffect(() => {
        if (salesList.length === 0) {
            setSalesList(sales.data);
        }
    }, []);

    const confirmDeleteSale = (saleId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la venta?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSale(saleId);
            }
        });
    };

    const deleteSale = async (saleId) => {
        try {
            const response = await deleteService(route('sale.delete', { saleId }), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if (response.ok) {
                const updatedSales = salesList.filter(sale => sale.id !== saleId);
                setSalesList(updatedSales);

                Swal.fire({
                    title: "Éxito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                throw new Error(jsonResponse.msg || 'No se pudo eliminar la venta.');
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || 'Ocurrió un error inesperado.',
                icon: "error"
            });
        }
    };

    const uniqueClients = Array.from(new Set(salesList.map(sale => sale.client.name)))
        .map(clientName => {
            const client = salesList.find(sale => sale.client.name === clientName);
            return { id: client.client.id, name: clientName };
        });

    const setSelectedClient = (client) => {
        setSelectedClientTitle(client.name);
        const filteredSales = salesList.filter(sale => sale.client.id === client.id);
        setActiveSales(filteredSales);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Ventas" />
            <div className="py-4 lg:py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="p-0">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Finanzas</p>
                                <h2 className="text-xl font-semibold text-gray-800">Ventas</h2>
                            </div>
                            <div className="flex gap-2">
                                <Link href={usePages.props.createSalesUrl}>
                                    <PrimaryButton className="bg-orange-600 text-white">
                                        Registrar Venta
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
                        <InputLabel value="Seleccione un cliente para ver la gráfica de ventas." />
                        <Dropdown>
                            <Dropdown.Trigger>
                                <DropDownToggle className="items-center cursor-pointer">
                                    {selectedClientTitle}
                                </DropDownToggle>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="left" className="px-2" width={100}>
                                {uniqueClients.map((client) => (
                                    <DropDownItem onClick={() => setSelectedClient(client)} key={client.id}>
                                        {client.name}
                                    </DropDownItem>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>

                        <div className="mt-4" style={{ height: 300 }}>
                            <LinearChart
                                readings={activeSales.map(sale => ({
                                    manual_created_at: sale.manual_created_at,
                                    total_value: sale.unit_cost * sale.total_weight
                                }))}
                                date="manual_created_at"
                                value="total_value"
                                chartId="sales"
                                tooltipFormatter={(value) => `$${value.toLocaleString('es-CO')}`}
                            />
                        </div>
                    </div>


                        <div className="bg-white overflow-x-auto shadow-sm rounded-lg py-5">
                            <table id="table-sales" className="w-full table table-auto">
                                <thead className="text-gray-900 font-bold">
                                    <tr>
                                        <td className="pl-5 pr-20">Cliente</td>
                                        <td className="pr-20">Precio unitario</td>
                                        <td className="pr-20">Peso total</td>
                                        <td className="pr-20 min-w-[200px]">Precio de venta</td>
                                        <td className="pr-20">Fecha</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesList.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                            <td className="font-bold pl-5">{sale.client.name.toUpperCase()}</td>
                                            <td className="pr-2">${sale.unit_cost.toLocaleString('es-CO')}</td>
                                            <td className="pr-2">{sale.total_weight.toLocaleString('es-CO')}</td>
                                            <td className="font-bold text-green-600">
                                                ${(sale.unit_cost * sale.total_weight).toLocaleString('es-CO')}
                                            </td>
                                            <td>{moment(sale.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                            <td className="flex gap-2 py-4">
                                                <Link href={route('sale.edit', { saleId: sale.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                         strokeWidth={1} stroke="currentColor"
                                                         className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </Link>
                                                <svg onClick={() => confirmDeleteSale(sale.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1" stroke="currentColor"
                                                     className="w-5 h-5 text-red-600 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                                                </svg>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination className="mt-6" links={sales.links} />

                </div>
            </div>

            {/* SweetAlert2 Custom Styles */}
            <style>
                {`
                .swal2-confirm.btn-confirm {
                    background-color: #f5f5f5 !important;
                    color: #dc2626 !important;
                    font-weight: bold;
                    border: 1px solid #dc2626 !important;
                    border-radius: 4px;
                    padding: 8px 20px;
                }

                .swal2-confirm.btn-confirm:hover {
                    background-color: #ffecec !important;
                    color: #b91c1c !important;
                }

                .swal2-cancel.btn-cancel {
                    background-color: #e5e7eb !important;
                    color: #374151 !important;
                    border-radius: 4px;
                    padding: 8px 20px;
                }

                .swal2-cancel.btn-cancel:hover {
                    background-color: #d1d5db !important;
                    color: #1f2937 !important;
                }
                `}
            </style>
        </AuthenticatedLayout>
    );
}
