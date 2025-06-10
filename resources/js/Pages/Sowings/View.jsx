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

export default function ViewSowing({ auth, sowing, statsReadings, biomasses, ponds, sowings }) {
    const usePages = usePage();
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
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.visit(route('sowings.index'));
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
        return stats.map((stat) => <Speedometer key={stat.id} stat={stat} />);
    };

    // 🔥 NUEVO: Speedometers con datos quemados
    const getStaticSpeedometersDom = () => {
        const staticData = [
            {
                id: 1,
                value: 22,
                triggered_alarm: false,
                step_stat: {
                    name: 'Temperatura agua',
                    value_minimun: 15,
                    value_maximun: 30
                }
            },
            {
                id: 2,
                value: 5.2,
                triggered_alarm: false,
                step_stat: {
                    name: 'Oxígeno disuelto',
                    value_minimun: 4,
                    value_maximun: 10
                }
            }
        ];

        return staticData.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg p-4 shadow-md">
                <Speedometer stat={stat} />
            </div>
        ));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cosecha" />

            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="p-6">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Cultivos</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {sowing.pond?.name}
                                </h2>
                            </div>
                            <Link href={route('sowing.edit', { sowingId: sowing.id })}>
                                <button className="px-4 py-2 border border-gray-500 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                                    Configuración
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-4">
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
                    <p className="mb-4 text-center">
                        Última actualización: {moment().format('YYYY-MM-DD - hh:mm a')}
                    </p>

                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        {getSpeedometersDom()}
                    </div>

                    {/* 🔥 Nuevo bloque con medidores estáticos */}
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-8">
                        {getStaticSpeedometersDom()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}