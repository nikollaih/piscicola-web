import {Link} from "@inertiajs/react";
export default function PondItem ({actuator, onDelete = () => {}}) {
    let iconTurnedOnColor = (actuator.is_turned_on === 1) ? "text-green-500" : "text-red-500";
    return (
        <Link className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-5 w-full cursor-pointer hover:bg-gray-50">
            <p className="text-lg font-bold mb-2">{actuator.name}</p>
            <p className="text-gray-500">Estanque</p>
            <p className="font-bold mb-1">{actuator.pond.name}</p>
            <p className="text-gray-500">Tipo de actuador</p>
            <p className="font-bold mb-1">{actuator.actuator_type.name}</p>
            <p className="text-gray-500">Costo por minuto</p>
            <p className="font-bold mb-1">${actuator.cost_by_minute.toLocaleString('es-CO')}</p>
            <hr className="my-2"/>
            <div className="flex">
                <p className={iconTurnedOnColor}>{(actuator.is_turned_on === 1) ? "Encendido" : "Apagado"}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className={`${iconTurnedOnColor} w-6 h-6 ml-2`}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"/>
                </svg>
            </div>
        </Link>
    )
}
