import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState } from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import { deleteService } from "@/Services/Services.ts";
import LinearChart from "@/Components/LinearChart.jsx";
import moment from "moment";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";

export default function Mortalities({ auth, sowing, mortalities, latestMortalities, createMortalityUrl, buttonText }) {
    const usePages = usePage();

    const confirmDeleteMortality = (mortalityId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la mortalidad?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMortality(mortalityId);
            }
        });
    };

    const deleteMortality = async (mortalityId) => {
        try {
            const response = await deleteService(route('mortality.delete', { mortalityId }), usePages.props.csrfToken);
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mortalidad" />

            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="p-6">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Cultivos</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {sowing?.pond?.name}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <Link href={createMortalityUrl}>
                                    <PrimaryButton>Registrar Mortalidad</PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                        <SowingInformation sowing={sowing} />
                    </div>

                    <ButtonsGroup sowing={sowing} />

                    <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4 mb-4">
                        <div className="bg-white rounded-lg p-2 shadow-md col-span-full">
                            <LinearChart readings={latestMortalities} date="manual_created_at" value="dead" chartId="mortalities" />
                        </div>
                    </div>

                    <div className="bg-white overflow-x-auto shadow-sm rounded-lg py-5">
                        <table id="table-mortalities" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                                <tr>
                                    <td className="pl-5 pr-20 min-w-[200px]">Cantidad de muestra</td>
                                    <td className="pr-20">Mortalidad</td>
                                    <td className="pr-20">Fecha</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {mortalities.data.map((mortality) => (
                                    <tr key={mortality.id} className="hover:bg-gray-100 hover:cursor-pointer">
                                        <td className="font-bold pl-5">{mortality.sample_quantity}</td>
                                        <td>{mortality.dead}</td>
                                        <td>{moment(mortality.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4 pr-4">
                                            <div className="flex gap-2">
                                                <Link href={`${usePages.props.baseUrl}/mortalities/${mortality.id}/edit`}>
                                                    <svg className="w-5 h-5 text-indigo-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                                    </svg>
                                                </Link>
                                                <svg onClick={() => confirmDeleteMortality(mortality.id)} className="w-5 h-5 text-red-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 0 0-3.478-.397m-12 .562a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination className="mt-6" links={mortalities.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
