import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {useEffect, useState} from "react";
import ActuatorInformation from "@/Pages/Actuators/Partials/ActuatorInformation.jsx";
import Swal from "sweetalert2";
import {deleteService, postService} from "@/Services/Services.ts";
import LinearChart from "@/Components/LinearChart.jsx";
import moment from "moment";
import Pagination from "@/Components/Pagination.jsx";
import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";

export default function ViewActuator({ auth, actuator, actuatorUses, readings }) {
    let iconTurnedOnColor = (actuator.is_turned_on === 1) ? "text-green-500" : "text-red-500";
    let usePages = usePage();
    const [chartParameter, setChartParameter] = useState('minutes');
    const [chartParameterTitle, setChartParameterTitle] = useState('Tiempo');

    /**
     * Prompt the actuator to confirm deletion of a actuator.
     *
     * @param {Object} actuatorId - The actuator id to be deleted.
     * @returns {void}
     */
    const confirmDeleteActuator = (actuatorId) => {

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el actuador?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteActuator(actuatorId);
            }
        });
    };

    /**
     * Delete a actuator asynchronously.
     *
     * @param {number} actuatorId - The ID of the actuator to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the actuator is deleted.
     */
    const deleteActuator = async (actuatorId) => {
        try {
            // Send a request to delete the actuator
            const response = await deleteService(route('actuator.delete', {actuatorId}), usePages.props.csrfToken);

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
                        router.visit(route('actuators'));
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

    const confirmTurnActuatorMqtt = (turned_on) => {
        let action = (turned_on) ? "encender" : "apagar";
        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: '¿Deseas '+action+' el actuador?',
            showCancelButton: true,
            confirmButtonColor: "#eb580b",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, " + action,
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                setTurnActuatorMqtt(turned_on);
            }
        });
    }

    const setTurnActuatorMqtt = async (turned_on) => {
        try {
            // Send a request to delete the actuator
            const response = await postService(route('mqtt.set.actuator.turn'), usePages.props.csrfToken, {mqtt_id: actuator.mqtt_id, status: (turned_on === 1) ? 'on' : 'off'});

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Actuador
                    </h2>
                </div>
            }
        >
            <Head title="Actuador"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex gap-4 justify-end mb-4 justify-between">
                        <div className="flex gap-4">
                            {
                                (actuator.is_turned_on === 1)
                                    ?
                                    <PrimaryButton onClick={() => {confirmTurnActuatorMqtt(0)}} className="bg-red-600">Apagar</PrimaryButton>
                                    :
                                    <PrimaryButton onClick={() => {confirmTurnActuatorMqtt(1)}} className="bg-green-600">Encender</PrimaryButton>
                            }
                        </div>
                        <div className="flex gap-4">
                            <Link href={route('actuator.edit', {actuatorId: actuator.id})}>
                                <PrimaryButton className="bg-orange-600">Modificar</PrimaryButton>
                            </Link>
                            <PrimaryButton onClick={() => {confirmDeleteActuator(actuator.id)}} className="bg-red-600">Eliminar</PrimaryButton>
                        </div>
                    </div>

                    <div className="md:grid-cols-3 sm:grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="bg-white p-2 sm:rounded-lg w-full shadow-md sm:col-span-1 md:col-span-1 w-full">
                            <ActuatorInformation actuator={actuator}/>
                        </div>
                        <div
                            className="col-span-2 sm:rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-2 grid grid-cols-1 bg-white">
                            <div className="md:col-span-1 sm:col-span-4 px-5 pt-2 mb-2">
                                <InputLabel value="Tipo de grafica"/>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <DropDownToggle
                                            className="items-center cursor-pointer">{chartParameterTitle}</DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2" width={100}>
                                        <DropDownItem onClick={() => {
                                                setChartParameter('minutes');
                                                setChartParameterTitle('Tiempo');
                                            }
                                        }>Tiempo</DropDownItem>
                                        <DropDownItem onClick={() => {
                                            setChartParameter('cost');
                                            setChartParameterTitle('Costo');
                                        }
                                        }>Costo</DropDownItem>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                            <LinearChart readings={readings} date="turned_off" value={chartParameter} chartId="actuatorUse"/>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-5">
                            <table id="table-actuatorUses" className="w-full table table-auto">
                                <thead className="text-gray-900 font-bold">
                                <td className="pl-5">Duración</td>
                                <td>Costo</td>
                                <td>Encendido</td>
                                <td>Apagado</td>
                                <td></td>
                                </thead>
                                <tbody>
                                {actuatorUses.data.map((actuator) => (
                                    <tr key={actuator.id} id={actuator.id}
                                        className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden py-4">
                                    <td className="font-bold pl-5 pr-2">{actuator.minutes} minutos</td>
                                        <td className="pr-2">${actuator.cost.toLocaleString('es-CO')}</td>
                                        <td className="py-2">{moment(actuator.turned_on).format(Constants.DATETIMEFORMAT)}</td>
                                        <td className=" pr-2">{moment(actuator.turned_off).format(Constants.DATETIMEFORMAT)}</td>
                                        <td className="flex gap-2 py-4">
                                            {
                                                /*(actuatorUses.data.length > 1) ?
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={usePages.props.baseUrl + '/actuatorUses/' + actuator.id + '/edit'}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 strokeWidth={1} stroke="currentColor"
                                                                 className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                            </svg>
                                                        </Link>
                                                        <svg onClick={() => {
                                                            confirmDeleteActuator(actuator.id)
                                                        }} xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24"
                                                             stroke-width="1" stroke="currentColor"
                                                             className="w-5 h-5 text-red-600">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                        </svg>
                                                    </div> : null*/
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination class="mt-6" links={actuatorUses.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
