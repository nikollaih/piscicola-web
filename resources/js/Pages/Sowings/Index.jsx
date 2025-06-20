import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import SowingItem from "@/Pages/Sowings/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { useEffect, useState } from "react";
import { deleteService } from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Sowings({ auth, sowings, request, createSowingUrl, baseUrl }) {
    let usePages = usePage();
    const [sowingsList, setUsersList] = useState([]);

    useEffect(() => {
        if (sowingsList.length === 0) {
            setUsersList(sowings.data);
        }
    }, []);

    const getSowingsDom = () => {
        return sowings.data.map((sowing) => (
            <SowingItem key={sowing.id} sowing={sowing} baseUrl={baseUrl} />
        ));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cosechas" />
            <div className="py-4 sm:py-8 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Cosechas
                        </h2>
                        <Link href={createSowingUrl}>
                            <PrimaryButton className="bg-orange-600 text-white">
                                Nueva cosecha
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {getSowingsDom()}
                    </div>
                    <Pagination className="mt-6" links={sowings.links} search={request.search} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
