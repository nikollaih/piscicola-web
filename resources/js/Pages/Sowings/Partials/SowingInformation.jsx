import moment from "moment";
import {Link, usePage} from "@inertiajs/react";
export default function SowingInformation ({sowing}) {
    let usePages = usePage();

    return <Link href={route('sowing.view', {sowingId: sowing.id})}>
        <div className="p-3 hover:bg-gray-100 rounded-md">
            <div className="mb-3">
                <p className="text-gray-600">Producto</p>
                <p className="font-semibold">{sowing.fish.name}</p>
            </div>
            <div className="mb-3">
                <p className="text-gray-600">Etapa</p>
                <p className="font-semibold">{sowing.step.name}</p>
            </div>
            <div className="mb-3">
                <p className="text-gray-600">Estanque</p>
                <p className="font-semibold">{sowing.pond.name}</p>
            </div>
            <div className="mb-3">
                <p className="text-gray-600">Cantidad de siembra</p>
                <p className="font-semibold">{(sowing.quantity - sowing.dead_quantity).toLocaleString('es-CO')} / {sowing.quantity.toLocaleString('es-CO')}</p>
            </div>
            <div className="">
                <p className="text-gray-600">Fecha de siembra</p>
                <p className="font-semibold">{moment(sowing.manual_created_at).format('YYYY-MM-DD')}</p>
            </div>
            {
                (sowing.sale_date) ?
                    <div className="mt-3">
                        <p className="text-gray-600">Fecha de venta</p>
                        <p className="font-semibold">{moment(sowing.sale_date).format('YYYY-MM-DD')} ({ moment(sowing.sale_date).diff(sowing.manual_created_at, 'months', true).toFixed(1)} meses)</p>
                    </div> : null
            }
        </div>
    </Link>
}
