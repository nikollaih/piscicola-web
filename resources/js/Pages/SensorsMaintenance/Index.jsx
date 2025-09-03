import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from "react";
import { deleteService } from "@/Services/Services.ts";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "../../../Constants.js";
import moment from "moment";

export default function SensorsMaintenance({ auth, maintenances, pondId }) {
    const usePages = usePage();
    const [maintenancesLis, setMaintenancesLis] = useState([]);

    useEffect(() => {
        if (maintenancesLis.length === 0) {
            setMaintenancesLis(maintenances.data);
        }
    }, []);

    const confirmDeleteMaintenance = (maintenanceId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el mantenimiento?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMaintenance(maintenanceId);
            }
        });
    };

    const deleteMaintenance = async (sensorMaintenanceId) => {
        try {
            const response = await deleteService(route('sensorMaintenance.delete', { sensorMaintenanceId }), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if (response.ok) {
                const updatedMaintenances = maintenancesLis.filter(maintenance => maintenance.id !== sensorMaintenanceId);
                setMaintenancesLis(updatedMaintenances);

                Swal.fire({
                    title: "Éxito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                throw new Error(jsonResponse.msg || 'No se pudo eliminar el mantenimiento.');
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
            <Head title="Ventas" />
            <div className="py-4 lg:py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="p-0">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Estanque</p>
                                <h2 className="text-xl font-semibold text-gray-800">Mantenimiento sensores</h2>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('sensorMaintenance.create', { pondId })}>
                                    <PrimaryButton className="bg-orange-600 text-white">
                                        Nuevo mantenimiento
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-x-auto shadow-sm rounded-lg py-5">
                        <table id="table-maintenances" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                            <tr>
                                <td className="pl-5 pr-20">Sensor</td>
                                <td className="pr-20">Fecha y hora</td>
                                <td className="pr-20">Encargado</td>
                                <td className="pr-20 min-w-[200px]">Observaciones</td>
                                <td className="pr-20">Adjunto</td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            {maintenancesLis.map((maintenance) => (
                                <tr key={maintenance.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                    <td className="font-bold pl-5">{maintenance.sensor_name}</td>
                                    <td className="pr-2">{moment(maintenance.maintenance_at).format(Constants.DATETIMEFORMAT)}</td>
                                    <td className="pr-2">{maintenance.operator_name}</td>
                                    <td className="pr-2">
                                        {maintenance.observations}
                                    </td>
                                    <td className="pr-2">
                                        {maintenance.evidence_path ? (
                                            <a
                                                href={`/storage/${maintenance.evidence_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 underline"
                                            >
                                                Ver archivo
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">Sin evidencia</span>
                                        )}
                                    </td>
                                    <td className="flex gap-2 py-4">
                                        {/*<Link
                                            href={route('sensorMaintenance.edit', {sensorMaintenanceId: maintenance.id})}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1} stroke="currentColor"
                                                 className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Link>*/}
                                        <svg onClick={() => confirmDeleteMaintenance(maintenance.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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
                    <Pagination className="mt-6" links={maintenances.links} />

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
