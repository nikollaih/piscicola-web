import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import SowingItem from "@/Pages/Sowings/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";

export default function Sowings({ auth, sowings, request, createSowingUrl, baseUrl }) {
    let usePages = usePage();
    const [sowingsList, setUsersList] = useState([]);

    useEffect(() => {
        if(sowingsList.length === 0){
            setUsersList(sowings.data)
        }
    }, [])

    const getSowingsDom = () => {
        return sowings.data.map((sowing) => {
            return <SowingItem sowing={sowing} baseUrl={baseUrl}/>
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cosechas</h2>}
        >
            <Head title="Cosechas" />
            <div className="py-4 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-end">
                        <Link href={createSowingUrl}>
                            <PrimaryButton className="bg-orange-600 h-10">
                                Agregar Cosecha
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-lg gap-4 p-1">
                        {getSowingsDom()}
                    </div>
                    <Pagination class="mt-6" links={sowings.links} search={request.search}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
