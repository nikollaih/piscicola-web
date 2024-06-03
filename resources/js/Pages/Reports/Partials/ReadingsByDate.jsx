import {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function ReadingsByDate({sowing}) {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);


    const generateReport = () => {
        let validateResoult = validateDates();
        if(validateResoult.status){
            window.open(route('readings.betweenDates.pdf', {sowingId:sowing.id,fromDate: fromDate,toDate: toDate}), '_blank');
        }else{
            console.log(validateResoult);
        }
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
            <div class="flex items-center space-x-2 justify-start">

                <label for="from-date" class="whitespace-nowrap w-11">Desde</label>
                <input 
                    type="date"
                    id="from-date"
                    class="border border-orange-500 rounded p-2" 
                    onChange={(e) => setFromDate(e.target.value)}
                    max={toDate}
                />

            </div>
            <div class="flex items-center space-x-2 justify-start ">
                
                <label for="to-datetime" class="whitespace-nowrap w-11">Hasta</label>
                <input 
                    type="date"
                    id="to-datetime"
                    class="border border-orange-500 rounded p-2" 
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate}
                />

            </div>
        </div>

        <PrimaryButton onClick={() => {generateReport()}} disabled={(sowing.name==null)} className="bg-orange-500 w-full mt-4 justify-center">Ver reporte</PrimaryButton>
    </div>
}
