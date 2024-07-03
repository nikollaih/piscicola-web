import moment from "moment/moment.js";
import LinearChart from "@/Components/LinearChart.jsx";



export default function ReadingsBetweenDatesTemplatePDF({ sowing,readings,fromDate,toDate }) {


    const readingComponents = Object.keys(readings).map((key) => {
        return <div key={key}>
            <div className="md:grid-cols-1 sm:grid-cols-1 grid gap-4 mb-6  mx-6">
                <div
                    className="col-span-1 rounded-lg p-2 shadow-md sm:col-span-1 md:col-span-1 grid grid-cols-1 bg-white">
                    <p className="px-4 pt-2 mb-4 font-bold text-lg">{readings[key][0].statName}</p>
                    <LinearChart readings={readings[key]} value="value" date="created_at" chartId={key}/>
                </div>
            </div>
        </div>
    });
    return (
     <div>
        <div className='flex-col justify-center'>
                <p className="text-center text-gray-500  font-semibold text-xl"> Lecturas entre   {fromDate} y {toDate} </p>
        </div>

        <div className='my-8'>
            <div className='flex-col justify-center'>
                <p className="text-center text-gray-500">Cosecha </p>
                <p className="text-center text-lg font-bold mb-2">{sowing.name}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-around text-center">

                <div className='flex-col'>
                    <p className="text-gray-500">Producto</p>
                    <p className="font-bold">{sowing.fish.name}</p>
                </div>
                <div className='flex-col'>
                    <p className="text-gray-500 mt-2">Estanque</p>
                    <p className="font-bold">{sowing.pond.name}</p>
                </div>
                <div className='flex-col'>
                    <p className="text-gray-500 mt-2">Etapa</p>
                    <p className="font-bold">{sowing.step.name}</p>
                </div>
                <div className='flex-col'>
                    <p className="text-gray-500 mt-2">Cantidad de siembra</p>
                    <p className="font-bold">{(sowing.quantity - sowing.dead_quantity).toLocaleString('es-CO')} / {sowing.quantity.toLocaleString('es-CO')}</p>
                </div>
                <div className='flex-col'>
                    <p className="text-gray-500 mt-2">Fecha de siembra</p>
                    <p className="font-semibold">{moment(sowing.manual_created_at).format('YYYY-MM-DD')} -  ({moment().diff(sowing.manual_created_at, 'days')} días)</p>
                </div>
                <div className='flex-col'>
                    {
                        (sowing.sale_date) ?
                            <p className="text-green-700 font-bold mt-4">Vendida</p> : null
                    }
                </div>
            </div>
        </div>
        <div>
            {readingComponents}
        </div>
    </div>
    );
}
