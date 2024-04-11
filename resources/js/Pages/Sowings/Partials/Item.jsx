import {Link} from "@inertiajs/react";
import moment from "moment/moment.js";

export default function SowingItem ({sowing, baseUrl}) {
    return (
        <Link href={`${baseUrl}/sowings/${sowing.id}/view`}
              className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5 cursor-pointer hover:bg-gray-50 w-full">
            <p className="text-lg font-bold mb-2">{sowing.name}</p>
            <p className="text-gray-500">Producto</p>
            <p className="font-bold">{sowing.fish.name}</p>
            <p className="text-gray-500 mt-2">Estanque</p>
            <p className="font-bold">{sowing.pond.name}</p>
            <p className="text-gray-500 mt-2">Etapa</p>
            <p className="font-bold">{sowing.step.name}</p>
            <p className="text-gray-500 mt-2">Cantidad de siembra</p>
            <p className="font-bold">{(sowing.quantity - sowing.dead_quantity).toLocaleString('es-CO')} / {sowing.quantity.toLocaleString('es-CO')}</p>
            <p className="text-gray-500 mt-2">Fecha de siembra</p>
            <p className="font-semibold">{moment(sowing.manual_created_at).format('YYYY-MM-DD')} -  ({moment().diff(sowing.manual_created_at, 'days')} días)</p>
            {
                (sowing.sale_date) ?
                    <p className="text-green-700 font-bold mt-4">Vendida</p> : null
            }
        </Link>
    )
}
