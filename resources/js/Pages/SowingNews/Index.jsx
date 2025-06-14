import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {useEffect, useState} from "react";
import SowingNewsItem from "@/Pages/SowingNews/Partials/Item.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";
import ButtonsGroup from "@/Pages/Sowings/Partials/ButtonsGroup.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";
import { Inertia } from '@inertiajs/inertia';


export default function SowingNews({ auth, news, sowing }) {
    const { url } = usePage();
    const currentParams = new URLSearchParams(url.split("?")[1]);
    const currentType = currentParams.get("type") || "Todos";

    const [filterType, setFilterType] = useState(currentType);

    useEffect(() => {
        if (filterType !== currentType) {
            const newParams = new URLSearchParams();
            if (filterType !== "Todos") {
                newParams.set("type", filterType);
            }

            Inertia.get(`${window.location.pathname}?${newParams.toString()}`, {}, {
                preserveState: true,
                replace: true,
            });
        }
    }, [filterType]);

    const getNewsDom = () => {
        return news.data.map((feed) => {
            return <SowingNewsItem key={feed.id} feed={feed} />
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

                    <div className={"mb-4"}>
                        <label htmlFor="">Filtrar</label>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <DropDownToggle
                                    className="items-center cursor-pointer">{filterType}</DropDownToggle>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="left" className="px-2" width={100}>
                                <DropDownItem key={null} onClick={() => { setFilterType("Todos") }}>Todos</DropDownItem>
                                <DropDownItem key={null} onClick={() => { setFilterType("MQTT Alarma") }}>MQTT Alarma</DropDownItem>
                                <DropDownItem key={null} onClick={() => { setFilterType("Pérdida de datos") }}>Pérdida de datos</DropDownItem>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
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
