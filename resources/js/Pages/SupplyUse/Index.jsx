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
import InputLabel from "@/Components/InputLabel.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import InputError from "@/Components/InputError.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";

export default function Feeding({ auth, sowing, feeds, readings, supplies, addRoute, deleteRoute, compareRoute, title }) {

    let usePages = usePage();
    const [supplyTitle, setSupplyTitle] = useState('Seleccionar');
    const [activeReadings, setActiveReadings] = useState([]);

    useEffect(() => {
        setInitialActiveReadings();
    }, []);

    const setInitialActiveReadings = () => {
        if(supplies.length > 0) {
            let supply = supplies[0];
            setSelectedSupply(supply);
        }
    }

    /**
     * Prompt the feed to confirm deletion of a feed.
     *
     * @param {Object} feedId - The feed id to be deleted.
     * @returns {void}
     */
    const confirmDeleteFeed = (feedId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el suministro?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFeed(feedId);
            }
        });
    };

    /**
     * Delete a feed asynchronously.
     *
     * @param {number} feedId - The ID of the feed to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the feed is deleted.
     */
    const deleteFeed = async (feedingId) => {
        try {
            // Send a request to delete the feed
            const response = await deleteService(route(deleteRoute, {feedingId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // Show a success message to the feed
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
                // If deletion failed, show an error message to the feed
                throw new Error(jsonResponse.msg || 'Failed to delete feed.');
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

    const getSupplyDropdownDom = () => {
        return supplies.map((item) => {
            return <DropDownItem onClick={() => {setSelectedSupply(item)}}>{item.name} - ({item.measurement_unit.name})</DropDownItem>
        })
    }

    const setSelectedSupply = (supply) => {
        let activeReadings = readings.data.filter((item) => item.supply_id === supply.id);
        setSupplyTitle(`${supply.name} - (${supply.measurement_unit.name})`);
        setActiveReadings(activeReadings);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Historial de {title}
                    </h2>
                </div>
            }
        >
            <Head title={`Historial de ${title}`}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex gap-4 justify-end mb-4">
                        <Link href={addRoute}>
                            <PrimaryButton className="bg-orange-600">Agregar</PrimaryButton>
                        </Link>
                    </div>

                    <div className="md:grid-cols-3 sm:grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="bg-white overflow-hidden sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-1 w-full">
                            <SowingInformation sowing={sowing}/>
                        </div>
                        <div
                            className="col-span-2 sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-2 grid grid-cols-1 bg-white">
                            <div className="px-4 mb-4 pt-2">
                                <InputLabel value="Seleccione un suministro para ver la grafica."/>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <DropDownToggle
                                            className="items-center cursor-pointer">{supplyTitle}</DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2" width={100}>
                                        {getSupplyDropdownDom()}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                            <div style={{height: 300}}>
                                <LinearChart readings={activeReadings} date="manual_created_at" value="quantity"
                                             chartId="feed"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-5">
                            <table id="table-feeds" className="w-full table table-auto">
                                <thead className="text-gray-900 font-bold">
                                <td className="pl-5">Producto</td>
                                <td>Cantidad</td>
                                <td>Costo</td>
                                <td>Fecha</td>
                                <td></td>
                                </thead>
                                <tbody>
                                {feeds.data.map((feed) => (
                                    <tr key={feed.id} id={feed.id}
                                        className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                        <td className="font-bold pl-5">{feed.supply.name}</td>
                                        <td className="font-bold">{feed.quantity} {feed.supply.measurement_unit.name}</td>
                                        <td className=" pr-2">${(feed.unit_cost * feed.quantity).toLocaleString('es-CO')}</td>
                                        <td className="pr-2">{moment(feed.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            <div className="flex gap-2">
                                                <Link href={route('feeding.edit', {feedingId: feed.id})}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         strokeWidth={1} stroke="currentColor"
                                                         className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Link>
                                                <svg onClick={() => {
                                                    confirmDeleteFeed(feed.id)
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
                        <Pagination class="mt-6" links={feeds.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
