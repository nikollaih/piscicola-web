import {useEffect, useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";

export default function ReadingsByDate({sowing}) {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);


    const generatePDFReport = () => {
        let validateResoult = validateDates();
        console.log(validateResoult);

    }
    const generateReport = () => {
        console.log("generando reporte")
    }
    const validateDates = () => {
        if(fromDate == null)
            return {"status":false,"msg":"La fecha Desde no puede estar vacía"}; 
        if(toDate == null)
            return {"status":false,"msg":"La fecha Hasta no puede estar vacía"}; 
        if(toDate<fromDate)
            return {"status":false,"msg":"La fecha Desde no puede ser mayor a la fecha Hasta"}; 

        return {"status":true,"msg":"Fechas ingresadas correctamente"};

    }

    return <div className="mt-4">

        <div class="flex flex-col space-y-4 p-4">
            <div class="flex items-center space-x-2">

                <label for="from-date" class="whitespace-nowrap">Desde</label>
                <input 
                    type="date"
                    id="from-date"
                    class="border border-gray-300 rounded p-2" 
                    onChange={(e) => setFromDate(e.target.value)}
                    max={toDate}
                />

            </div>
            <div class="flex items-center space-x-2">
                
                <label for="to-datetime" class="whitespace-nowrap">Hasta</label>
                <input 
                    type="date"
                    id="to-datetime"
                    class="border border-gray-300 rounded p-2" 
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate}
                />

            </div>
        </div>

        <PrimaryButton onClick={() => {generateReport()}} disabled={(sowing.name==null)} className="bg-orange-500 w-full mt-4 justify-center">Ver reporte</PrimaryButton>
        <PrimaryButton onClick={() => {generatePDFReport()}} disabled={(sowing.name==null)} className="bg-orange-500 w-full mt-4 justify-center">Generar reporte en PDF </PrimaryButton>
    </div>
}
