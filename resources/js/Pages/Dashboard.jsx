import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            
        >
            <Head title="Dashboard" />

            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="p-6">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Inicio
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6 text-gray-900">Bienvenido!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
