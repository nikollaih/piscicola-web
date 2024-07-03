import moment from "moment";
import {Link, usePage} from "@inertiajs/react";
import {useState} from "react";
export default function SowingInformation ({sowing}) {
    const initialShowSowing = window.innerWidth;
    const [showSowing, setShowSowing] = useState((initialShowSowing >= 768));
    let usePages = usePage();

    return <div>
        {((initialShowSowing < 768) &&
            <div className="flex justify-between items-center">
                <h2 className="ml-3 font-semibold">Cosecha</h2>
                <button
                    onClick={() => setShowSowing((previousState) => !previousState)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
                >
                    <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path
                            className={!showSowing ? 'inline-flex' : 'hidden'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                        <path
                            className={showSowing ? 'inline-flex' : 'hidden'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                    </svg>
                </button>
            </div>)}

        <Link href={route('sowing.view', {sowingId: sowing.id})}
              className={(showSowing ? "block" : "hidden") + " p-3 hover:bg-gray-100 rounded-md transition duration-2000 ease-in-out"}>
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
                        <p className="font-semibold">{moment(sowing.sale_date).format('YYYY-MM-DD')} ({moment(sowing.sale_date).diff(sowing.manual_created_at, 'months', true).toFixed(1)} meses)</p>
                    </div> : null
            }
        </Link>
    </div>
}
