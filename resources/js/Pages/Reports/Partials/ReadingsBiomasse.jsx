import {useEffect, useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";

export default function ReadingsBiomasseReport({sowing, biomasses}) {
    const [selectedBiomasse, setSelectedBiomasse] = useState({approximate_weight: 'Seleccionar'});

    useEffect(() => {
        setSelectedBiomasse({approximate_weight: 'Seleccionar'});
    }, [sowing]);

    const generateReport = () => {
        location.href = route('readings.biomasse.report.exports', {biomasseId: selectedBiomasse.id});
    }

    const getBiomassesDropdownDom = () => {
        return biomasses.map((item) => {
            return <DropDownItem onClick={() => {setSelectedBiomasse(item)}}>{item.approximate_weight}gr</DropDownItem>
        })
    }

    return <div className="mt-4">
        <p>Biomasa</p>
        <Dropdown>
            <Dropdown.Trigger>
                <DropDownToggle
                    className="items-center cursor-pointer">{selectedBiomasse.approximate_weight}</DropDownToggle>
            </Dropdown.Trigger>
            <Dropdown.Content align="left" className="px-2" width={100}>
                {getBiomassesDropdownDom()}
            </Dropdown.Content>
        </Dropdown>
        <p className="mt-4">Se generará un archivo de formato excel con el registro de biomasas pertenecientes a la cosecha "{sowing.name}"</p>
        <PrimaryButton onClick={() => {generateReport()}} disabled={(!selectedBiomasse?.id)} className="bg-orange-500 w-full mt-4 justify-center">Generar reporte</PrimaryButton>
    </div>
}
