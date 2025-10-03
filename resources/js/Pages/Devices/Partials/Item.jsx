import {Link} from "@inertiajs/react";
export default function PondItem ({device}) {
    let iconTurnedOnColor = (device.is_turned_on === 1) ? "text-green-500" : "text-red-500";
    return (
        <Link href={route('device.view', {deviceId: device.id})}
              className="bg-white overflow-hidden shadow-sm rounded-lg p-5 w-full cursor-pointer hover:bg-gray-50">
            <p className="text-lg font-bold mb-2">{device.name}</p>
            <p className="text-gray-500">Estanque</p>
            <p className="font-bold mb-1">{device.pond.name}</p>
            <p className="text-gray-500">Tipo de actuador</p>
            <p className="font-bold mb-1">{device.device_type.name}</p>
            <p className="text-gray-500">Costo por minuto</p>
            <p className="font-bold mb-1">${device.cost_by_minute.toLocaleString('es-CO')}</p>
            <p className="text-gray-500">MQTT ID</p>
            <p className="font-bold mb-1">{device.mqtt_id}</p>
            <hr className="my-2"/>
            <div className="flex">
                <p className={iconTurnedOnColor}>{(device.is_turned_on === 1) ? "Encendido" : "Apagado"}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className={`${iconTurnedOnColor} w-6 h-6 ml-2`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"/>
                </svg>
            </div>
        </Link>
    )
}
