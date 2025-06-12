import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Dashboard({ auth, step_stats, stepId }) {
    let usePages = usePage();
    // Define the search variable
    const [searchValue, setSearchValue] = useState("");
    const [stepStatsList, setStepStatsList] = useState([]);

    useEffect(() => {
        if(stepStatsList.length === 0){
            setStepStatsList(step_stats.data)
        }
    }, [])

    /**
     * Prompt the user to confirm deletion of a step_stat.
     *
     * @param {Object} step_stat - The step_stat object to be deleted.
     * @returns {void}
     */
    const confirmDeleteStep_stat = (step_stat) => {
        const { name, id } = step_stat; // Destructure step_stat object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el parámetro ${name.toUpperCase()}?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteStep_stat(id);
            }
        });
    };

    /**
     * Delete a step_stat asynchronously.
     *
     * @param {number} stepStatId - The ID of the step_stat to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the step_stat is deleted.
     */
    const deleteStep_stat = async (stepStatId) => {
        try {
            // Send a request to delete the step_stat
            const response = await deleteService(route('step_stat.delete', {stepStatId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // If successful, update the step_stat list
                const updatedStep_stats = stepStatsList.filter(step_stat => step_stat.id !== stepStatId);
                setStepStatsList(updatedStep_stats);

                // Show a success message to the user
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete step_stat.');
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configuración de parámetros</h2>}
        >
            <Head title="Configuración de parámetros" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-between">
                        <div />
                        <Link href={route('step_stat.create', {stepId: stepId})} className="self-end">
                            <PrimaryButton className="bg-orange-500 h-10">
                                Agregar
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg py-5">
                        <table id="table-step_stats" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                                <td className="pl-5 pb-4">Nombre</td>
                                <td>Key</td>
                                <td>Minimo</td>
                                <td>Maximo</td>
                                <td>Etapa</td>
                            <td></td>
                            </thead>
                            <tbody>
                            { stepStatsList.map( (step_stat) => (
                                <tr key={step_stat.id} id={step_stat.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                    <td className="font-bold pl-5">{step_stat.name.toUpperCase()}</td>
                                    <td className=" pr-2">{step_stat.key}</td>
                                    <td className="pr-2">{step_stat.value_minimun}</td>
                                    <td className="pr-2">{step_stat.value_maximun}</td>
                                    <td>{step_stat.step.name}</td>
                                    <td className="flex gap-2 py-4">
                                        <Link href={route('step_stat.edit', {stepStatId: step_stat.id, stepId: stepId})}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1} stroke="currentColor"
                                                 className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                            </svg>
                                        </Link>
                                        <svg onClick={() => {confirmDeleteStep_stat(step_stat)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1" stroke="currentColor"
                                             className="w-5 h-5 text-red-600">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination class="mt-6" links={step_stats.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
