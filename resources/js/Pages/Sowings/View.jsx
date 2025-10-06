import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState } from "react";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import Swal from "sweetalert2";
import { deleteService } from "@/Services/Services.ts";
import Speedometer from "@/Components/Speedometer.jsx";
import BiomassesChartHistory from "@/Pages/Biomasses/Partials/ChartHistory.jsx";
import moment from "moment";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import PHMeter from "@/Components/PHMeter.jsx";
import {createPortal} from "react-dom";
import Modal from "@/Components/Modal.jsx";
import {BaseModal} from "@/Components/BaseModal.jsx";
import {ManualReading} from "@/Pages/Sowings/Partials/ManualReading.jsx";

export default function ViewSowing({ auth, sowing, statsReadings, biomasses, ponds, sowings, stepStats }) {
    const usePages = usePage();
    const [showModalManual, setShowModalManual] = useState(false);
    const { env } = usePage().props;

    const [stats] = useState(statsReadings);

    const confirmDeleteSowing = (sowingId) => {
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar la cosecha?`,
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

    const deleteSowing = async (sowingId) => {
        try {
            const response = await deleteService(route('sowing.delete', { sowingId }), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if (response.ok) {
                Swal.fire({
                title: "Éxito",
                text: jsonResponse.msg,
                icon: "success",
                confirmButtonText: "Continuar",
                customClass: {
                    confirmButton: 'swal2-confirm',
                },
                buttonsStyling: false // para que no se apliquen estilos por defecto
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
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

    const getSpeedometersDom = () => {
        return stats.map((stat) => {
            const HIDDEN_READINGS = env.HIDDEN_READINGS ? env.HIDDEN_READINGS.split(",") : [];
            if(!HIDDEN_READINGS.includes(stat.step_stat.key)){
                if(stat.step_stat.key.toLowerCase() === 'ph'){
                    return <PHMeter key={stat.id} stat={stat} />
                }
                return <Speedometer key={stat.id} stat={stat} />
            }
            else return null
        });
    };


    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const LastUpdate = () => {
        // Ordena por fecha descendente y toma el más reciente
        const latestCreatedAt = Array.isArray(statsReadings) && statsReadings.length
            ? statsReadings
                .slice()
                .sort((a, b) => new Date(b.topic_time) - new Date(a.topic_time))[0]
                .topic_time
            : new Date(); // Si está vacío, usa la fecha actual

        return (
            <p className={"mb-4 text-center"}>Última lectura: {formatDate(latestCreatedAt)}</p>
        );
    };

    return (
        <>
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cosecha" />

            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="pb-5">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Cosechas</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {sowing.pond?.name}
                                </h2>
                            </div>
                            <Link href={route('sowing.edit', { sowingId: sowing.id })}>
                                <PrimaryButton className="bg-gray-800">
                                    Configuración
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-0 sm:mb-4">
                        <SowingInformation sowing={sowing} />
                    </div>

                    <ButtonsGroup sowing={sowing} onDelete={confirmDeleteSowing} />

                    <div className="  grid grid-cols-1 md:grid-cols-3 sm:gap-4 mb-4">
                        <div className="bg-white rounded-lg p-2 shadow-md col-span-full">
                            <BiomassesChartHistory biomasses={biomasses.data} />
                        </div>
                    </div>

                    <p className="font-bold text-xl text-center">
                        Lectura de parámetros{" "}
                        <span onClick={() => location.reload()} className="text-orange-600 cursor-pointer">(Actualizar)</span>
                    </p>
                    <LastUpdate />

                    <div className={'flex justify-center mb-5'}>
                        <PrimaryButton
                            className={'bg-orange-500 mx-auto'}
                            onClick={() => setShowModalManual(true)}
                        >
                            Nueva lectura manual
                        </PrimaryButton>
                    </div>

                    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                        {getSpeedometersDom()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
            {
                showModalManual && createPortal(
                    <BaseModal
                        title={"Nueva lectura manual"}
                        onClose={() => setShowModalManual(false)}
                    >
                        <ManualReading stepStats={stepStats} sowing={sowing} />
                    </BaseModal>,
                    document.body
                )
            }
        </>
    );
}
