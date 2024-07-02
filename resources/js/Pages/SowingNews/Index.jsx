import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import {useEffect} from "react";
import SowingNewsItem from "@/Pages/SowingNews/Partials/Item.jsx";

export default function SowingNews({ auth, news }) {
    let usePages = usePage();

    useEffect(() => {
    }, [])

    const getNewsDom = () => {
        return news.data.map((feed) => {
            return <SowingNewsItem feed={feed} />
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bitácora</h2>}
        >
            <Head title="Novedades" />
            <div className="py-4 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-4">
                        {getNewsDom()}
                    </div>
                    <Pagination class="mt-6" links={news.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
