import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {useEffect, useState} from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import {deleteService} from "@/Services/Services.ts";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Speedometer from "@/Components/Speedometer.jsx";
import BiomassesChartHistory from "@/Pages/Biomasses/Partials/ChartHistory.jsx";
import moment from "moment";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";

export default function ViewSowing({ auth, sowing, statsReadings, biomasses, baseUrl }) {
    let usePages = usePage();
    const [stats] = useState(statsReadings);

    /**
     * Prompt the sowing to confirm deletion of a sowing.
     *
     * @param {Object} sowing - The sowing object to be deleted.
     * @returns {void}
     */
    const confirmDeleteSowing = (sowingId) => {

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la cosecha ?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSowing(sowingId);
            }
        });
    };

    /**
     * Delete a sowing asynchronously.
     *
     * @param {number} sowingId - The ID of the sowing to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the sowing is deleted.
     */
    const deleteSowing = async (sowingId) => {
        try {
            // Send a request to delete the sowing
            const response = await deleteService(route('sowing.delete', {sowingId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // Show a success message to the sowing
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success",
                    confirmButtonText: "Continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.visit(route('sowings'));
                    }
                });
            } else {
                // If deletion failed, show an error message to the sowing
                throw new Error(jsonResponse.msg || 'Failed to delete sowing.');
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

    const getSpeedometersDom = () => {
        return stats.map((stat) => {
            return <Speedometer stat={stat} />
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Cosecha
                    </h2>
                </div>
            }
        >
            <Head title="Cosecha"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <ButtonsGroup sowing={sowing} onDelete={confirmDeleteSowing}/>
                    <div className="md:grid-cols-3 sm:grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="bg-white overflow-hidden sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-1 w-full">
                            <SowingInformation sowing={sowing}/>
                        </div>
                        <div
                            className="col-span-2 sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-2 grid grid-cols-1 bg-white">
                                <BiomassesChartHistory biomasses={biomasses.data} />
                        </div>
                    </div>
                    <p className="font-bold text-xl text-center">Lectura de parámetros <span onClick={() => {location.reload()}} className="text-orange-600 cursor-pointer">(Actualizar)</span></p>
                    <p className="mb-4 text-center">Ultima actualización: {moment().format('YYYY-MM-DD - hh:mm a')}</p>
                    <div className="col-span-2  sm:col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                        {getSpeedometersDom()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
