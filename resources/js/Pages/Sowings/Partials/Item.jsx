import {Link} from "@inertiajs/react";
export default function SowingItem ({sowing, baseUrl}) {
    return (
        <Link href={`${baseUrl}/sowings/${sowing.id}/view`} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5 cursor-pointer hover:bg-gray-50 w-full">
            <p className="text-gray-500">Producto</p>
            <p className="font-bold">{sowing.fish.name}</p>
            <p className="text-gray-500 mt-2">Estanque</p>
            <p className="font-bold">{sowing.pond.name}</p>
            <p className="text-gray-500 mt-2">Etapa</p>
            <p className="font-bold">{sowing.step.name}</p>
            <p className="text-gray-500 mt-2">Cantidad de peces</p>
            <p className="font-bold">{sowing.quantity}</p>
        </Link>
    )
}
