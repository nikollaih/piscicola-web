import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {postService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Dashboard({ auth }) {
    let usePages = usePage();

    const askForGlobalStatus = async () => {
        console.log(usePages.props.csrfToken);
        try {
            // Send a request to delete the actuator
            const response = await postService(route('mqtt.ask.full.status'), usePages.props.csrfToken, {});

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

        >
            <Head title="Dashboard" />

            <Head title="Cosechas" />
            <div className="py-4 sm:py-8 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Inicio
                        </h2>
                            <PrimaryButton onClick={() => askForGlobalStatus()} className="bg-orange-600 text-white">
                                Obtener estado actual
                            </PrimaryButton>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6 text-gray-900">Bienvenido!</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
