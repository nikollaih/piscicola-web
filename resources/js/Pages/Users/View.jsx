import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {useEffect, useState} from "react";
import DangerButton from "@/Components/DangerButton.jsx";
import UserEvents from "@/Pages/Users/Partials/UserEvents.jsx";
import UserInformation from "@/Pages/Users/Partials/UserInformation.jsx";
import Swal from "sweetalert2";
import {deleteService} from "@/Services/Services.ts";

export default function ViewUser({ auth, user, loggedUser, envRoles }) {
    let { ROLE_ADMIN_LAYER } = envRoles;
    let usePages = usePage();
    const [events, setEvents] = useState([{},{},{}]);

    useEffect(() => {

    }, [])

    /**
     * Prompt the user to confirm deletion of a user.
     *
     * @param {Object} user - The user object to be deleted.
     * @returns {void}
     */
    const confirmDeleteUser = (user) => {
        const { name, id } = user; // Destructure user object

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el usuario ${name.toUpperCase()}?`,
            showCancelButton: true,
            confirmButtonColor: "#dd2627",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(id);
            }
        });
    };

    /**
     * Delete a user asynchronously.
     *
     * @param {number} userId - The ID of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves once the user is deleted.
     */
    const deleteUser = async (userId) => {
        try {
            // Send a request to delete the user
            const response = await deleteService(route('user.delete', {userId}), usePages.props.csrfToken);

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
                        router.visit(route('users'));
                    }
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete user.');
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
                        {user.name.toUpperCase()}
                    </h2>
                </div>
            }
        >
            <Head title="Useres"/>
            <div className="py-4 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <div className="">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Usuarios</p>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {user.name.toUpperCase()}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid-cols-2 grid gap-4">

                        <div className="bg-white overflow-hidden rounded-lg p-5 shadow-md">
                            <UserInformation user={user}/>
                        </div>

                        <div className="bg-white overflow-hidden rounded-lg p-5 shadow-md">
                            <UserEvents events={events} />
                        </div>

                    </div>

                    {
                        (loggedUser.role.rol === ROLE_ADMIN_LAYER && user.id !== loggedUser.id) ?
                            <div className="bg-white overflow-hidden rounded-lg p-5 shadow-md mt-5">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">Eliminar usuario</h2>
                                    <p className="mt-1 text-gray-600 mb-4">
                                        Una vez que se elimine la cuenta, todos sus recursos y datos se borrarán permanentemente. Antes de eliminar tu cuenta, por favor descarga cualquier dato o información que desees conservar.
                                    </p>
                                </header>
                                <DangerButton onClick={() => {
                                    confirmDeleteUser(user)
                                }}>Eliminar</DangerButton>
                            </div> : null
                    }


                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
