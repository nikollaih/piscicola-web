import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function SowingResume({ auth, sowing }) {
    let usePages = usePage().props;

    const getActuatorsCostDom = () => {
        return usePages.actuatorsCost.map((actuator) => {
            return <div className="flex justify-between pl-4">
                <p className="fonst-bold">- {actuator.name}</p>
                <p>${actuator.total_cost.toLocaleString('es-CO')}</p>
            </div>
        })
    }

    const getExpensesCostDom = () => {
        return usePages.expensesCost.map((expense) => {
            return <div className="flex justify-between pl-4">
                <p className="fonst-bold">- {expense.name}</p>
                <p>${expense.total_cost.toLocaleString('es-CO')}</p>
            </div>
        })
    }

    const getTotal = () => {
        let total = 0;
        total += usePages.feedingCost + usePages.medicineCost;

        usePages.actuatorsCost.map((actuator) => {
            total += actuator.total_cost;
        })

        usePages.expensesCost.map((expense) => {
            total += expense.total_cost;
        })

        return total;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Resumen financiero de la cosecha
                    </h2>
                </div>
            }
        >
            <Head title="Biomasa"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex gap-4  mb-4">
                        <Link href={route('sowing.view', {sowingId: sowing.id})}>
                            <PrimaryButton className="bg-gray-800">Regresar</PrimaryButton>
                        </Link>
                    </div>

                    <div className="md:grid-cols-3 sm:grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="bg-white overflow-hidden sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-1 w-full">
                            <SowingInformation sowing={sowing}/>
                        </div>
                        <div
                            className="col-span-2 sm:rounded-lg p-6 shadow-md bg-white">
                            <p className="text-lg font-bold mb-4">Resumen de costos</p>

                            <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed laoreet
                                velit elementum cursus finibus. Phasellus dapibus eget ligula vel bibendum. Suspendisse
                                potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                                cubilia curae; Curabitur imperdiet suscipit consectetur. Fusce sed varius nisl, a
                                porttitor odio.</p>

                            <div className="flex justify-between">
                                <p className="font-bold">Alimentación</p>
                                <p>${usePages.feedingCost.toLocaleString('es-CO')}</p>
                            </div>
                            <hr className="my-3"/>
                            <div className="flex justify-between">
                                <p className="font-bold">Medicamentos</p>
                                <p>${usePages.medicineCost.toLocaleString('es-CO')}</p>
                            </div>
                            <hr className="my-3"/>
                            <div className="">
                                <p className="font-bold mb-3">Actuadores</p>
                                {getActuatorsCostDom()}
                            </div>
                            <hr className="my-3"/>
                            <div className="">
                                <p className="font-bold mb-3">Gastos</p>
                                {getExpensesCostDom()}
                            </div>
                            <hr className="my-3"/>
                            <div className="flex justify-between">
                                <p className="text-lg font-bold">Total</p>
                                <p className="text-lg font-bold text-red-500">${getTotal().toLocaleString('es-CO')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
