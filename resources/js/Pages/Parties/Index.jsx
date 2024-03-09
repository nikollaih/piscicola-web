import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Dashboard({ auth, clients, request, url, createClientUrl }) {
    let usePages = usePage();
    // Define the search variable
    const [searchValue, setSearchValue] = useState("");
    const [clientsList, setClientsList] = useState([]);

    useEffect(() => {
        if(clientsList.length === 0){
            setClientsList(clients.data)
        }

        // Set the searched value by default
        if(request?.search) setSearchValue(request.search);
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
                // If successful, update the client list
                const updatedClients = clientsList.filter(client => client.id !== clientId);
                setClientsList(updatedClients);

                // Show a success message to the user
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success"
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Clientes</h2>}
        >
            <Head title="Clientes" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4">
                        <div className="flex-1">
                            <form>
                                <TextInput
                                    onChange={(event) => {
                                        setSearchValue(event.target.value);
                                    }}
                                    className="w-2/4"
                                    type="text"
                                     name="search"
                                    placeholder="Documento, nombre o teléfono" value={searchValue}
                                    required={true}/>
                                <PrimaryButton
                                    className="bg-indigo-500 ml-4 h-10"
                                    type="submit"
                                >
                                    Buscar
                                </PrimaryButton>
                                {
                                    (request?.search) ?
                                        <Link href={url}>
                                            <PrimaryButton
                                                className="bg-gray-500/75 ml-4 h-10"
                                                type="reset"
                                            >
                                                Limpiar
                                            </PrimaryButton>
                                        </Link>: null
                                }
                            </form>
                        </div>
                        <Link href={createClientUrl}>
                            <PrimaryButton className="bg-indigo-500 h-10">
                                Agregar
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-5">
                        <table id="table-clients" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                                <td></td>
                                <td>Nombre</td>
                                <td>Documento</td>
                                <td>Celular</td>
                                <td>Telefono oficina</td>
                                <td>Email</td>
                                <td></td>
                            </thead>
                            <tbody>
                            { clientsList.map( (client) => (
                                <tr key={client.id} id={client.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                    <td className="pl-5">
                                        {
                                            (client.type === 1) ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                     stroke="currentColor" className="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                     stroke="currentColor" className="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
                                                </svg>
                                        }
                                    </td>
                                    <td className="font-bold">
                                        <Link href={usePages.props.baseUrl + '/clients/' + client.id + '/view'} className="text-indigo-600">
                                            {client.name.toUpperCase()}
                                        </Link>
                                    </td>
                                    <td className=" pr-2">{client.document}</td>
                                    <td className="pr-2">{client.mobile_phone}</td>
                                    <td className="pr-2">{client.office_phone}</td>
                                    <td>{client.email}</td>
                                    <td className="flex gap-2 py-4">
                                        <Link href={usePages.props.baseUrl + '/clients/' + client.id + '/edit'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1} stroke="currentColor"
                                                 className="w-5 h-5 text-indigo-600 cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                            </svg>
                                        </Link>
                                        <svg onClick={() => {confirmDeleteClient(client)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1" stroke="currentColor"
                                             className="w-5 h-5 text-red-600">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination class="mt-6" links={clients.links} search={request.search}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
