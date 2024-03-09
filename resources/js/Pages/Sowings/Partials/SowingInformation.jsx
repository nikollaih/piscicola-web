import moment from "moment";
import {Link, usePage} from "@inertiajs/react";
export default function SowingInformation ({sowing}) {
    let usePages = usePage();

    return <Link href={`${usePages.props.baseUrl}/sowings/${sowing.id}/view`}>
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
                <p className="text-gray-600">Cantidad de peces</p>
                <p className="font-semibold">{sowing.quantity}</p>
            </div>
            <div className="">
                <p className="text-gray-600">Fecha de creación</p>
                <p className="font-semibold">{moment(sowing.created_at).format('YYYY-MM-DD')}</p>
            </div>
        </div>
    </Link>
}
