import {Link} from "@inertiajs/react";
export default function PondItem ({pond}) {
    return (
        <Link className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5 cursor-pointer hover:bg-gray-50 w-full">
            <p className="text-lg font-bold mb-2">{pond.name}</p>
            <p className="text-gray-500">Área</p>
            <p className="font-bold mb-1">{pond.area}mts2</p>
            <p className="text-gray-500">Volumen</p>
            <p className="font-bold mb-1">{pond.volume}L</p>
            <p className="text-gray-500">Caudal de entrada</p>
            <p className="font-bold mb-1">{pond.entrance}L/s</p>
            <p className="text-gray-500">Caudal de salida</p>
            <p className="font-bold mb-1">{pond.exit}L/s</p>
            <p className="text-gray-500">Cubierto</p>
            <p className="font-bold">{(pond.covered === 1) ? "Si" : "No" }</p>
        </Link>
    )
}
