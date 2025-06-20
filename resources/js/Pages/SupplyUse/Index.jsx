import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useEffect, useState } from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import { deleteService } from "@/Services/Services.ts";
import LinearChart from "@/Components/LinearChart.jsx";
import moment from "moment";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";

export default function Feeding({ auth, sowing, feeds, readings, supplies, addRoute, deleteRoute, compareRoute, title, buttonText }) {
    let usePages = usePage();
    const [supplyTitle, setSupplyTitle] = useState('Seleccionar');
    const [activeReadings, setActiveReadings] = useState([]);

    useEffect(() => {
        setInitialActiveReadings();
    }, []);

    const setInitialActiveReadings = () => {
        if (supplies.length > 0) {
            let supply = supplies[0];
            setSelectedSupply(supply);
        }
    }

    const confirmDeleteFeed = (feedId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el suministro?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFeed(feedId);
            }
        });
    };

    const deleteFeed = async (feedingId) => {
        try {
            const response = await deleteService(route(deleteRoute, { feedingId }), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Éxito",
                    text: jsonResponse.msg,
                    icon: "success",
                    confirmButtonText: "Continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.reload();
                    }
                });
            } else {
                throw new Error(jsonResponse.msg || 'Falló la eliminación.');
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || 'Ocurrió un error inesperado.',
                icon: "error"
            });
        }
    };

    const getSupplyDropdownDom = () => {
        return supplies.map((item) => (
            <DropDownItem onClick={() => setSelectedSupply(item)} key={item.id}>
                {item.name} - ({item.measurement_unit.name})
            </DropDownItem>
        ));
    };

    const setSelectedSupply = (supply) => {
        let activeReadings = readings.data.filter((item) => item.supply_id === supply.id);
        setSupplyTitle(`${supply.name} - (${supply.measurement_unit.name})`);
        setActiveReadings(activeReadings);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cosecha" />

            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="mb-10">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Cosechas</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {sowing.pond?.name}
                                </h2>
                            </div>
                            <Link href={addRoute}>
                                <PrimaryButton className="bg-orange-600 h-10 text-white">{buttonText}</PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-0 sm:mb-4">
                        <SowingInformation sowing={sowing} />
                    </div>

                    <ButtonsGroup sowing={sowing} />

                    {/* Gráfica */}
                    <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4 mb-4">
                        <div className="bg-white rounded-lg p-2 shadow-md col-span-full">
                            <div className="px-4 mb-4 pt-2">
                                <InputLabel className='mb-5' value="Seleccione un suministro para ver la gráfica." />
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <DropDownToggle className="items-center cursor-pointer">
                                            {supplyTitle}
                                        </DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2" width={100}>
                                        {getSupplyDropdownDom()}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[320px] sm:min-w-0" style={{ height: 300 }}>
                                    <LinearChart
                                        readings={activeReadings}
                                        date="manual_created_at"
                                        value="quantity"
                                        chartId="feed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white overflow-x-auto shadow-md rounded-lg py-5">
                        <table id="table-feeds" className="min-w-[640px] w-full table-auto">
                            <thead className="text-gray-900 font-bold">
                                <tr>
                                    <td className="pl-5 pr-20">Producto</td>
                                    <td className="pr-20">Cantidad</td>
                                    <td className="pr-20">Costo</td>
                                    <td className="pr-20">Fecha</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {feeds.data.map((feed) => (
                                    <tr key={feed.id} id={feed.id} className="hover:bg-gray-100 hover:cursor-pointer">
                                        <td className="font-bold pl-5">{feed.supply.name}</td>
                                        <td className="font-bold">{feed.quantity} {feed.supply.measurement_unit.name}</td>
                                        <td>${(feed.unit_cost * feed.quantity).toLocaleString('es-CO')}</td>
                                        <td>{moment(feed.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            <Link href={route('feeding.edit', { feedingId: feed.id })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </Link>
                                            <svg onClick={() => confirmDeleteFeed(feed.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-5 h-5 text-red-600 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                                            </svg>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination className="mt-6" links={feeds.links} />
                    </div>
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
