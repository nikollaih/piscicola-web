import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {postService} from "@/Services/Services.ts";
import Swal from "sweetalert2";
import {useCallback, useMemo} from "react";
import {DashboardPondStatus} from "@/Components/Dashboard/PondItem.jsx";
import {DashboardActuatorStatus} from "@/Components/Dashboard/ActuatorItem.jsx";
import {DashboardDeviceStatus} from "@/Components/Dashboard/DeviceItem.jsx";

export default function Dashboard({ auth, ponds, actuators, devices }) {
    console.log(devices)
    let usePages = usePage();

    const askForGlobalStatus = async () => {
        console.log(usePages.props.csrfToken);
        try {
            // Send a request to delete the actuator
            const response = await postService(route('mqtt.ask.full.status'), usePages.props.csrfToken, {});

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // Show a success message to the actuator
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
                // If deletion failed, show an error message to the actuator
                throw new Error(jsonResponse.msg || 'Failed to delete actuator.');
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

    const dashboardPonds = useMemo(() => {
        if (!ponds || !Array.isArray(ponds.data)) return null;

        return ponds.data.map((p) => (
            <DashboardPondStatus
                key={p.id ?? p._id ?? Math.random()}
                pond={p}
            />
        ));
    }, [ponds]);

    const dashboardActuators = useMemo(() => {
        if (!actuators || !Array.isArray(actuators.data)) return null;

        return actuators.data.map((a) => (
            <DashboardActuatorStatus
                key={a.id ?? a._id ?? Math.random()}
                actuator={a}
            />
        ));
    }, [actuators]);

    const dashboardMaintenances = useMemo(() => {
        if (!devices || !Array.isArray(devices.data)) return null;

        return devices.data.map((d) => (
            <DashboardDeviceStatus
                key={d.id ?? d._id ?? Math.random()}
                device={d}
            />
        ));
    }, [devices]);

    return (
        <AuthenticatedLayout
            user={auth.user}

        >
            <Head title="Dashboard" />

            <Head title="Cosechas" />
            <div className="py-4 sm:py-8 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">

                        </h2>
                            <PrimaryButton onClick={() => askForGlobalStatus()} className="bg-orange-600 text-white">
                                Obtener estado actual
                            </PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6 text-gray-900 font-bold text-center text-xl">Estado general de la unidad</div>
                    </div>
                    <div>
                        <p className={'font-semibold text-gray-900 mb-4 text-md mt-10'}>Estanques</p>
                        <div className={'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg'}>
                            {dashboardPonds}
                        </div>
                        <p className={'font-semibold text-gray-900 mb-4 text-md mt-10'}>Actuadores</p>
                        <div className={'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg'}>
                            {dashboardActuators}
                        </div>
                        <p className={'font-semibold text-gray-900 mb-4 text-md mt-10'}>Mantenimientos (Dispositivos y/o sensores)</p>
                        <div className={'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg'}>
                            {dashboardMaintenances}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
