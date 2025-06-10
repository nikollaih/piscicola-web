import {Link} from "@inertiajs/react";
export default function AssociationItem ({productiveUnit, onDelete = () => {}}) {
    return (
        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-5 w-full flex flex-col justify-between">
            <div>
                <p className="text-lg font-bold mb-2">{productiveUnit.name}</p>
                <p className="text-gray-500">Email</p>
                <p className="font-bold mb-1">{productiveUnit.email}</p>
                <p className="text-gray-500">Celular</p>
                <p className="font-bold mb-1">{productiveUnit.mobile_phone}</p>
                <p className="text-gray-500">Teléfono</p>
                <p className="font-bold mb-1">{productiveUnit.phone}</p>
                <p className="text-gray-500">Dirección</p>
                <p className="font-bold mb-1">{productiveUnit.address}</p>
            </div>
            <div>
                <hr className="my-2"/>
                <div className="flex justify-between">
                    <Link href={route('productive_unit.edit', {productiveUnitId: productiveUnit.id})}
                          className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1} stroke="currentColor"
                             className="w-5 h-5 text-blue-600 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>
                    </Link>
                    <Link href={route('users', {productiveUnitId: productiveUnit.id})}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5 text-orange-500">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
                        </svg>
                    </Link>
                    <Link onClick={() => {
                        onDelete(productiveUnit)
                    }} className="flex items-center ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth="1" stroke="currentColor"
                             className="w-5 h-5 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}
