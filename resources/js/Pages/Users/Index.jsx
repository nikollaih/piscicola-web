import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { useEffect, useState } from "react";
import { deleteService, pathService } from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Users({ auth, users, request, url, createUserUrl }) {
    let usePages = usePage();
    const [searchValue, setSearchValue] = useState("");
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        if (usersList.length === 0) {
            setUsersList(users.data);
        }

        if (request?.search) setSearchValue(request.search);
    }, []);

    const confirmDeleteUser = (user) => {
        const { name, id } = user;

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el usuario ${name.toUpperCase()}?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(id);
            }
        });
    };

    const confirmRestorePassword = (user) => {
        const { name, id } = user;

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas restablecer la contraseña para el usuario ${name.toUpperCase()}?`,
            showCancelButton: true,
            confirmButtonText: "Sí, restablecer",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                restorePassword(id);
            }
        });
    };

    const restorePassword = async (userId) => {
        try {
            const response = await pathService(route('user.password', { userId }), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Éxito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                throw new Error(jsonResponse.msg || 'Error al restablecer la contraseña.');
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

    const deleteUser = async (userId) => {
        try {
            const response = await deleteService(route('user.delete', { userId }), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if (response.ok) {
                const updatedUsers = usersList.filter(user => user.id !== userId);
                setUsersList(updatedUsers);

                Swal.fire({
                    title: "Éxito",
                    text: jsonResponse.msg,
                    icon: "success"
                });
            } else {
                throw new Error(jsonResponse.msg || 'Error al eliminar el usuario.');
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: 'Ha ocurrido un error, intente de nuevo más tarde.',
                icon: "error"
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Usuarios" />
            <div className="py-4 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>
                        </div>
                        <div className="flex gap-4 justify-between sm:justify-end mb-4">
                            <Link href={createUserUrl}>
                                <PrimaryButton className="bg-orange-500 h-10 text-white">
                                    Nuevo Usuario
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white overflow-x-auto shadow-sm rounded-lg py-5">
                        <table id="table-users" className="w-full table table-auto">
                            <thead className="text-gray-900 font-bold">
                                <tr>
                                    <td className="pl-5 pr-20 min-w-[200px]">Nombre</td>
                                    <td className="pr-20">Rol</td>
                                    <td className="pr-20">Documento</td>
                                    <td className="pr-20">Celular</td>
                                    <td className="pr-20">Email</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden">
                                        <td className="font-bold pl-5">{user.name.toUpperCase()}</td>
                                        <td>{user.role.name}</td>
                                        <td>{user.document}</td>
                                        <td>{user.mobile_phone}</td>
                                        <td>{user.email}</td>
                                        <td className="flex gap-2 py-4 pr-6">
                                            <Link href={usePages.props.baseUrl + '/users/' + user.id + '/edit'}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth={1} stroke="currentColor"
                                                    className="w-5 h-5 text-indigo-600 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                                </svg>
                                            </Link>
                                            {auth.user.role_id <= 2 && (
                                                <svg onClick={() => confirmRestorePassword(user)} xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                    className="w-5 h-5 text-orange-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                </svg>
                                            )}
                                            <svg onClick={() => confirmDeleteUser(user)} xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"
                                                className="w-5 h-5 text-red-600">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21a48.11 48.11 0 0 0-3.478-.397m-12 .562a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                                            </svg>

                                        {
                                            (auth.user.role_id <= 2) ?
                                                <svg onClick={() => {
                                                    confirmRestorePassword(user)
                                                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor"
                                                     className="w-5 h-5 text-orange-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                                                </svg> : null
                                        }

                                        <svg onClick={() => {
                                            confirmDeleteUser(user)
                                        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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
                    <Pagination class="mt-6" links={users.links} search={request.search} />
                </div>
            </div>

            {/* SweetAlert2 Custom Styles */}
            <style>
                {`
                .swal2-confirm.btn-confirm {
                    background-color: #f5f5f5 !important;
                    color: #dc2626 !important;
                    font-weight: bold;
                    border: 1px solid #dc2626 !important;
                    border-radius: 4px;
                    padding: 8px 20px;
                }

                .swal2-confirm.btn-confirm:hover {
                    background-color: #ffecec !important;
                    color: #b91c1c !important;
                }

                .swal2-cancel.btn-cancel {
                    background-color: #e5e7eb !important;
                    color: #374151 !important;
                    border-radius: 4px;
                    padding: 8px 20px;
                }

                .swal2-cancel.btn-cancel:hover {
                    background-color: #d1d5db !important;
                    color: #1f2937 !important;
                }
                `}
            </style>
        </AuthenticatedLayout>
    );
}
