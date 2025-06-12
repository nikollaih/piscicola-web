import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {useEffect} from "react";
import SowingNewsItem from "@/Pages/SowingNews/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";

export default function SowingNews({ auth, news, sowing }) {
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
        >
            <Head title="Novedades" />
            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-10">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Cosecha</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Bitacora
                                </h2>
                            </div>
                            <div className="flex mb-4 justify-end">
                                <Link href="/sowings">
                                    <PrimaryButton>
                                        Regresar
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                        <SowingInformation sowing={sowing}/>
                    </div>
                    <ButtonsGroup sowing={sowing}/>
                    <br/>
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
