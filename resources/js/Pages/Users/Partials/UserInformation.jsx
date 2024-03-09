export default function UserInformation ({user}) {
    return <div className="p-4">
        <div className="mb-4">
            <p className="text-gray-600">Documento:</p>
            <p className="font-semibold">{user.document}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Nombre:</p>
            <p className="font-semibold">{user.name}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Correo electrónico:</p>
            <p className="font-semibold">{user.email}</p>
        </div>
        <div className="mb-4">
            <p className="text-gray-600">Celular:</p>
            <p className="font-semibold">{user.mobile_phone}</p>
        </div>
    </div>
}
