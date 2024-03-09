import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import PondItem from "@/Pages/Ponds/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Ponds({ auth, ponds, request }) {
    let usePages = usePage();
    const [pondsList, setUsersList] = useState([]);

    useEffect(() => {
        if(pondsList.length === 0){
            setUsersList(ponds.data)
        }
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
                // If successful, update the user list
                const updatedUsers = pondsList.filter(user => user.id !== userId);
                setUsersList(updatedUsers);

                // Show a success message to the user
                Swal.fire({
                    title: "Exito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                // If deletion failed, show an error message to the user
                throw new Error(jsonResponse.msg || 'Failed to delete user.');
            }
        } catch (error) {
            // Handle any errors
            Swal.fire({
                title: "Error",
                text: 'Ha ocurrido un error, intente de nuevo más tarde.',
                icon: "error"
            });
        }
    };

    const getPondsDom = () => {
        return ponds.data.map((pond) => {
            return <PondItem pond={pond}/>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Estanques</h2>}
        >
            <Head title="Estanques" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-end">
                        <Link>
                            <PrimaryButton className="bg-orange-600 h-10">
                                Agregar Estanque
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 border border-dashed border-gray-200 rounded-lg gap-4 p-1">
                        {getPondsDom()}
                    </div>
                    <Pagination class="mt-6" links={ponds.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
