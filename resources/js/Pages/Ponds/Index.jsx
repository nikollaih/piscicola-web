import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import PondItem from "@/Pages/Ponds/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Ponds({ auth, ponds }) {
    let usePages = usePage();

    useEffect(() => {}, []);

    const confirmDeletePond = (pond) => {
        const { name, id } = pond;

        Swal.fire({
            title: "¿Estás seguro(a)?",
            text: `¿Deseas eliminar el estanque "${name}"?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deletePond(id);
            }
        });
    };

    const deletePond = async (pondId) => {
        try {
            const response = await deleteService(route('pond.delete', {pondId}), usePages.props.csrfToken);
            const jsonResponse = await response.json();

            if(response.ok) {
                Swal.fire({
                    title: "Éxito",
                    text: jsonResponse.msg,
                    icon: "success",
                    confirmButtonText: "Continuar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.reload();
                    }
                });
            } else {
                throw new Error(jsonResponse.msg || 'Falló la eliminación.');
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || 'Ocurrió un error inesperado.',
                icon: "error"
            });
        }
    };

    const getPondsDom = () => {
        return ponds.data.map((pond) => {
            return <PondItem key={pond.id} pond={pond} onDelete={confirmDeletePond} />;
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Estanques" />
            <div className="py-4 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Infraestructura</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Estanques
                                </h2>
                            </div>
                            <div className="flex mb-4 justify-end">
                                <Link href={route('pond.create')}>
                                    <PrimaryButton className="bg-orange-600 h-10 text-white">
                                        Nuevo estanque
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-lg gap-4 p-1">
                        {getPondsDom()}
                    </div>
                    <Pagination className="mt-6" links={ponds.links} />
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
