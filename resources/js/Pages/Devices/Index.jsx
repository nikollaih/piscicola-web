import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import Constants from "@/../Constants.js";
import Pagination from "@/Components/Pagination.jsx";
import LinearChart from "@/Components/LinearChart.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Devices({ auth, sowing, devices }) {

    const page = usePage();
    const { success, errors } = page.props;

    useEffect(() => {
        if (success) {
            Swal.fire({
                title: "Éxito",
                text: success,
                icon: "success"
            });
        }

        if (errors?.msg) {
            Swal.fire({
                title: "Error",
                text: errors.msg,
                icon: "error"
            });
        }
    }, [success, errors]);

    const confirmDeleteDevice = (deviceId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el dispositivo?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('device.delete', { deviceId }));
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dispositivos" />
            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="mb-10">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Finanzas</p>
                                <h2 className="text-xl font-semibold text-gray-800">Dispositivos</h2>
                            </div>
                            <div className="flex gap-2">
                                <Link href={page.props.createDeviceUrl}>
                                    <PrimaryButton className="bg-orange-600 text-white">Registrar Dispositivo</PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white shadow-sm rounded-lg py-5 overflow-x-auto">
                            <table id="table-devices" className="w-full table table-auto">
                                <thead className="text-gray-900 font-bold">
                                <tr>
                                    <td className="pl-5 pr-20">Dispositivo</td>
                                    <td className="pr-20">Categoría</td>
                                    <td className="pr-20 min-w-[250px]">Estanque</td>
                                    <td className="pr-20">Periodo de mantenimiento</td>
                                    <td className="pr-20">Fecha</td>
                                    <td></td>
                                </tr>
                                </thead>
                                <tbody>
                                {devices.data.map((device) => (
                                    <tr key={device.id} className="hover:bg-gray-100 cursor-pointer">
                                        <td className="font-bold pl-5 pr-4">{device?.name}</td>
                                        <td>{device?.category}</td>
                                        <td>{device?.pond?.name ?? 'No aplica'}</td>
                                        <td>Cada {device?.maintenance_period} días</td>
                                        <td>{moment(device.created_at).format(Constants.DATEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            <div className="flex gap-2 pr-4">
                                                <Link href={route('device.edit', { deviceId: device.id, sowingId: sowing?.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                         strokeWidth={1} stroke="currentColor" className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                                    </svg>
                                                </Link>
                                                <svg onClick={() => confirmDeleteDevice(device.id)} xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"
                                                     className="w-5 h-5 text-red-600 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination className="mt-6" links={devices.links} />
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
