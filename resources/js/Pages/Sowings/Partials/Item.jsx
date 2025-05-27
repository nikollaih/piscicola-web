import { Link } from "@inertiajs/react";

export default function SowingItem({ sowing, baseUrl }) {
    const stepProgress = {
        1: 25,
        2: 50,
        3: 100,
    };

    const progreso = stepProgress[sowing.step_id] || 0;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm mx-auto hover:shadow-lg transition-all space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
                {sowing.name}
            </h3>
            <p className="font-bold">{sowing.pond.name}</p>


            <p className="text-sm text-gray-500">Cumplimiento del ciclo</p>

            <div className="w-full h-2 bg-gray-200 rounded-full relative">
                <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${progreso}%` }}
                ></div>
                <span className="absolute right-0 -top-5 text-xs text-gray-500">
                    {progreso}%
                </span>
            </div>

            <Link
                href={`${baseUrl}/sowings/${sowing.id}/view`}
                className="block text-center text-orange-700 font-semibold text-sm bg-orange-100 hover:bg-orange-200 transition-all rounded-md py-2"
            >
                Ver información del cultivo
            </Link>
        </div>
    );
}
