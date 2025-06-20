import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";
import {useState} from "react";
import ReadingStatHistory from "@/Components/ReadingStatHistory.jsx";

export default function MortalitiesReadings({ auth, sowing, biomasses, readings, biomasseOne, biomasseTwo }) {
    let usePages = usePage();
    const [selectedBiomasseOne, setSelectedBiomasseOne] = useState(biomasseOne);
    const [selectedBiomasseTwo, setSelectedBiomasseTwo] = useState(biomasseTwo);

    const getBiomasseDropdownDom = (type) => {
        return biomasses.data.map((biomasse) => {
            return <DropDownItem onClick={() => {setSelectedBiomasse(biomasse, type)}}>{biomasse.approximate_weight}gr</DropDownItem>
        })
    }

    const setSelectedBiomasse = (biomasse, type) => {
        if(type === 1)
            setSelectedBiomasseOne(biomasse)
        else
            setSelectedBiomasseTwo(biomasse)
    }

    const getReadings = () => {
        router.visit(route('mortality.readings', {sowingId: sowing.id, biomasseIdOne: selectedBiomasseOne.id, biomasseIdTwo: selectedBiomasseTwo.id}))
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center sm:hidden">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Registros de mortalidad
                    </h2>
                </div>
            }
        >
            <Head title="Registros de mortalidad"/>
            <div className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="flex gap-4 justify-end mb-4">
                        <Link href={route('mortalities', {sowingId: sowing.id})}>
                            <PrimaryButton className="bg-gray-800">Regresar</PrimaryButton>
                        </Link>
                    </div>

                    <div className="md:grid-cols-1 sm:grid-cols-1 grid gap-4 mb-6">
                        <div
                            className="rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-2 grid grid-cols-2 bg-white p-6">
                            <div className="md:col-span-1 sm:col-span-2">
                                <p className="font-bold text-lg mb-1">Biomasas</p>
                                <InputLabel className="mb-4"
                                            value="A continuación podrá seleccionar hasta 2 biomasas para generar la comparación de registros entre ellas."/>
                                <div className="flex align-middle items-center gap-2">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{(selectedBiomasseOne?.approximate_weight) ? (selectedBiomasseOne.approximate_weight + 'gr') : 'Seleccionar'}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getBiomasseDropdownDom(1)}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    <p>Comparar con</p>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{(selectedBiomasseTwo?.approximate_weight) ? (selectedBiomasseTwo.approximate_weight + 'gr') : 'Seleccionar'}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getBiomasseDropdownDom(2)}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    <PrimaryButton onClick={() => {
                                        getReadings()
                                    }} className="bg-orange-600">Comparar</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <ReadingStatHistory key={1} readings={readings.data_one} stepStat={readings.step_stat} value="dead" date="manual_created_at"  />
                        </div>
                        <div>
                            <ReadingStatHistory key={1} readings={readings.data_two} stepStat={readings.step_stat} value="dead" date="manual_created_at"  />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
