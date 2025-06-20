import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState } from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import { deleteService } from "@/Services/Services.ts";
import BiomassesChartHistory from "@/Pages/Biomasses/Partials/ChartHistory.jsx";
import moment from "moment";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";

export default function Biomasses({ auth, sowing, biomasses, latestBiomasses, createBiomasseUrl, buttonText }) {
    const usePages = usePage();

    const confirmDeleteBiomasse = (biomasseId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la biomasa?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBiomasse(biomasseId);
            }
        });
    };

    const deleteBiomasse = async (biomasseId) => {
        try {
            const response = await deleteService(route('biomasse.delete', { biomasseId }), usePages.props.csrfToken);
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
            <Head title="Biomasa" />

            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="mb-10">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Cosechas</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {sowing?.pond?.name}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <Link className="md:grid" href={route('biomasse.readings', { sowingId: sowing.id })}>
                                    <PrimaryButton className="bg-gray-800 text-white">Histórico de lecturas</PrimaryButton>
                                </Link>
                                <Link href={createBiomasseUrl}>
                                    <PrimaryButton className='bg-orange-600 h-10 text-white'>Nueva biomasa</PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-0 sm:mb-4">
                        <SowingInformation sowing={sowing} />
                    </div>

                    <ButtonsGroup sowing={sowing} />

                    <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4 mb-4">
                        <div className="bg-white rounded-lg p-2 shadow-md col-span-full">
                            <BiomassesChartHistory biomasses={latestBiomasses} />
                        </div>
                    </div>

                    <div className="bg-white overflow-x-auto shadow-sm rounded-lg py-5">
                        <table id="table-biomasses" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                                <tr>
                                    <td className="pl-5 pr-20">Peso (gr)</td>
                                    <td className="pl-5 pr-20">Tamaño (cm)</td>
                                    <td className="pr-20 min-w-[180px]">Cantidad de muestra</td>
                                    <td className="pr-20">Fecha</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {biomasses.data.map((biomasse) => (
                                    <tr key={biomasse.id} className="hover:bg-gray-100 hover:cursor-pointer">
                                        <td className="font-bold pl-5">{biomasse.approximate_weight}gr</td>
                                        <td className="font-bold pl-5">{biomasse.approximate_height}cm</td>
                                        <td>{biomasse.quantity_of_fish}</td>
                                        <td>{moment(biomasse.manual_created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            {biomasses.data.length > 1 && (
                                                <div className="flex gap-2 pr-4">
                                                    <Link href={`${usePages.props.baseUrl}/biomasses/${biomasse.id}/edit`}>
                                                        <svg className="w-5 h-5 text-indigo-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </Link>
                                                    <svg onClick={() => confirmDeleteBiomasse(biomasse.id)} className="w-5 h-5 text-red-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination className="mt-6" links={biomasses.links} />
                    </div>
                </div>
            </div>

            {/* Estilos para botón de eliminación SweetAlert2 */}
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
