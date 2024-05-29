import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState} from "react";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";
import ReportItem from "@/Pages/Reports/Partials/Item.jsx";
import BiomassesReport from "@/Pages/Reports/Partials/Biomasses.jsx";
import {getService} from "@/Services/Services.ts";
import ReadingsBiomasseReport from "@/Pages/Reports/Partials/ReadingsBiomasse.jsx";
import ReadingsByDate from "@/Pages/Reports/Partials/ReadingsByDate.jsx";
import SuppliesSowing from "@/Pages/Reports/Partials/SuppliesSowing.jsx";

const reports = [
    {
        id: 1,
        "name": "Biomasas por cosecha"
    },
    {
        id: 2,
        "name": "Alimentación por cosecha"
    },
    {
        id: 3,
        "name": "Medicamentos por cosecha"
    },
    {
        id: 4,
        "name": "Lecturas por biomasa"
    },
    {
        id: 5,
        "name": "Lecturas por fechas"
    },
];

export default function Reports({ auth, sowings }) {
    let usePages = usePage();
    const [selectedReport, setSelectedReport] = useState(1);
    const [selectedSowing, setSelectedSowing] = useState({});
    const [selectedSowingTitle, setSelectedSowingTitle] = useState('Seleccionar');
    const [biomasses, setBiomasses] = useState([]);

    const getReportsDom = () => {
        return reports.map((report) => {
            return <ReportItem selectedReport={selectedReport} report={report} onSelect={(report) => {setSelectedReport(report.id)}}/>
        })
    }

    const getBiomasses = async (sowingId) => {
        let response = await getService(route('biomasses.sowing', {sowingId: sowingId}), usePages.props.csrfToken);
        if(response.ok) {
            let biomasses = await response.json();
            setBiomasses(biomasses.data);
        }
        else setBiomasses([]);
    }

    const getReportFormDom = () => {
        switch (selectedReport) {
            case 1:
                return <BiomassesReport sowing={selectedSowing}/>
                break;
            case 2:
                return <SuppliesSowing  sowing={selectedSowing} useType="ALIMENT"/>
                break;
            case 3:
                return <SuppliesSowing  sowing={selectedSowing} useType="MEDICINE"/>
                break;
            case 4:
                return <ReadingsBiomasseReport sowing={selectedSowing} biomasses={biomasses}/>
                break;
            case 5:
                return <ReadingsByDate sowing={selectedSowing} />
                  

            default: break;
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Reportes
                    </h2>
                </div>
            }
        >
            <Head title="Reportes"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="md:grid-cols-3 sm:grid-cols-1 grid gap-4 mb-6">
                        <div className="col-span-1 w-full grid">
                            {getReportsDom()}
                        </div>
                        <div className="col-span-1 w-full grid">
                            <div
                                className="col-span-2 sm:rounded-lg p-4 shadow-md grid grid-cols-1 bg-white mb-4">
                                <p>Cosecha</p>
                                <Dropdown className="mb-4">
                                    <Dropdown.Trigger>
                                        <DropDownToggle
                                            className="items-center cursor-pointer">{selectedSowingTitle}</DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2" width={100}>
                                        {
                                            sowings.data.map((sowing) => {
                                                return <DropDownItem onClick={() => {
                                                    setSelectedSowing(sowing);
                                                    setSelectedSowingTitle(sowing.name);
                                                    getBiomasses(sowing.id);
                                                }
                                                }>{sowing.name}</DropDownItem>
                                        })
                                        }
                                    </Dropdown.Content>
                                    {getReportFormDom()}
                                </Dropdown>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
