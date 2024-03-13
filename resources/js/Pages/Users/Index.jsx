import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Users({ auth, users, request, url, createUserUrl }) {
    let usePages = usePage();
    // Define the search variable
    const [searchValue, setSearchValue] = useState("");
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        if(usersList.length === 0){
            setUsersList(users.data)
        }

        // Set the searched value by default
        if(request?.search) setSearchValue(request.search);
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
                const updatedUsers = usersList.filter(user => user.id !== userId);
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}
        >
            <Head title="Useres" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-between">
                        <div/>
                        {/*<div className="flex-1">
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
                        </div>*/}
                        <Link href={createUserUrl}>
                            <PrimaryButton className="bg-orange-500 h-10">
                                Agregar
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-5">
                        <table id="table-users" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                                <td className="pl-5">Nombre</td>
                                <td>Documento</td>
                                <td>Celular</td>
                                <td>Email</td>
                                <td></td>
                            </thead>
                            <tbody>
                            { usersList.map( (user) => (
                                <tr key={user.id} id={user.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                    <td className="font-bold pl-5">
                                        <Link href={usePages.props.baseUrl + '/users/' + user.id + '/view'} className="text-indigo-600">
                                            {user.name.toUpperCase()}
                                        </Link>
                                    </td>
                                    <td className=" pr-2">{user.document}</td>
                                    <td className="pr-2">{user.mobile_phone}</td>
                                    <td>{user.email}</td>
                                    <td className="flex gap-2 py-4">
                                        <Link href={usePages.props.baseUrl + '/users/' + user.id + '/edit'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1} stroke="currentColor"
                                                 className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                            </svg>
                                        </Link>
                                        <svg onClick={() => {confirmDeleteUser(user)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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
                    <Pagination class="mt-6" links={users.links} search={request.search}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
