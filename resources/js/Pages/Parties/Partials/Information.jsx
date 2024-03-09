export default function Information ({client}) {
    return <div className="p-4">
        <div className="mb-4">
            <p className="text-gray-600">Documento:</p>
            <p className="font-semibold">{client.document}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Nombre:</p>
            <p className="font-semibold">{client.name}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Correo electrónico:</p>
            <p className="font-semibold">{client.email}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Celular:</p>
            <p className="font-semibold">{client.mobile_phone}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Teléfono de casa:</p>
            <p className="font-semibold">{client.home_phone}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Teléfono de oficina:</p>
            <p className="font-semibold">{client.office_phone}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Ciudad:</p>
            <p className="font-semibold">{`${client.city.state.name}, ${client.city.name}`}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Notas:</p>
            <p className="font-semibold">{client.notes}</p>
        </div>
    </div>
}
