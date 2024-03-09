import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import {useEffect, useState} from "react";
import {deleteService} from "@/Services/Services.ts";
import Swal from "sweetalert2";
import SupplyItem from "@/Pages/Supplies/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Supplies({ auth, supplies, request, url, createSupplyUrl }) {
    let usePages = usePage();
    // Define the search variable
    const [searchValue, setSearchValue] = useState("");
    const [suppliesList, setSuppliesList] = useState([]);

    useEffect(() => {
        if(suppliesList.length === 0){
            setSuppliesList(supplies.data)
        }

        // Set the searched value by default
        if(request?.search) setSearchValue(request.search);
    }, [])

    const getSuppliesDom = () => {
        if(suppliesList.length > 0) {
            return suppliesList.map((supply) => {
                return <SupplyItem supply={supply} />
            })
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Suministros</h2>}
        >
            <Head title="Suministros" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex mb-4 justify-end">
                        <Link href={createSupplyUrl}>
                            <PrimaryButton className="bg-orange-600 h-10">
                                Agregar
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 border border-dashed border-gray-200 rounded-lg gap-4 p-1">
                        {getSuppliesDom()}
                    </div>
                    <Pagination class="mt-6" links={supplies.links} search={request.search}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
