import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {useEffect, useState} from "react";
import moment from "moment";
import DangerButton from "@/Components/DangerButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Cases from "@/Pages/Parties/Partials/Cases.jsx";
import Information from "@/Pages/Parties/Partials/Information.jsx";
import Swal from "sweetalert2";
import {deleteService} from "@/Services/Services.ts";

export default function ViewClient({ auth, client, loggedUser, envRoles }) {
    let { ROLE_ADMIN_LAYER } = envRoles;
    let usePages = usePage();
    const [cases, setCases] = useState([{},{},{}]);

    useEffect(() => {

    }, [])

    /**
     * Prompt the user to confirm deletion of a client.
     *
     * @param {Object} client - The client object to be deleted.
     * @returns {void}
     */
    const confirmDeleteClient = (client) => {
        const { name, id } = client; // Destructure client object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el cliente ${name.toUpperCase()}?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClient(id);
            }
        });
    };

    /**
     * Delete a client asynchronously.
     *
     * @param {number} clientId - The ID of the client to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the client is deleted.
     */
    const deleteClient = async (clientId) => {
        try {
            // Send a request to delete the client
            const response = await deleteService(route('client.delete', {clientId}), usePages.props.csrfToken);

            // Parse the response body as JSON
            const jsonResponse = await response.json();

            // Check if the deletion was successful
            if(response.ok) {
                // Show a success message to the user
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success",
                    confirmButtonText: "Continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.visit(route('clients'));
                    }
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete client.');
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
                    {
                        (client.type === 1) ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
                            </svg>
                    }
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight ml-3">
                        {client.name.toUpperCase()}
                    </h2>
                </div>
            }
        >
            <Head title="Clientes"/>
            <div className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="grid-cols-2 grid gap-4">

                        <div className="bg-white overflow-hidden rounded-lg p-5 shadow-md">
                            <Information client={client}/>
                        </div>

                        <div className="bg-white overflow-hidden rounded-lg p-5 shadow-md">
                        <Cases cases={cases} />
                        </div>

                    </div>

                    {
                        (loggedUser.role.rol === ROLE_ADMIN_LAYER) ?
                            <div className="bg-white overflow-hidden rounded-lg p-5 shadow-md mt-5">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">Eliminar cliente</h2>
                                    <p className="mt-1 text-gray-600 mb-4">
                                        Una vez que se elimine la cuenta, todos sus recursos y datos se borrarán
                                        permanentemente. Antes de eliminar tu cuenta, por favor descarga cualquier dato
                                        o información que desees conservar.
                                    </p>
                                </header>
                                <DangerButton onClick={() => {
                                    confirmDeleteClient(client)
                                }}>Eliminar</DangerButton>
                            </div> : null
                    }

                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
