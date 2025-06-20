import { Link } from "@inertiajs/react";
import dayjs from "dayjs"; // Instala dayjs: npm install dayjs

export default function SowingItem({ sowing, baseUrl }) {
    // Calcula porcentaje de días transcurridos hasta la fecha estimada
    const now = dayjs();
    const fechaEstimada = sowing.fecha_estimada ? dayjs(sowing.fecha_estimada) : null;

    let progreso = 0;

    if (fechaEstimada) {
        const totalDias = fechaEstimada.diff(dayjs(sowing.manual_created_at), 'day');
        const diasPasados = now.diff(dayjs(sowing.manual_created_at), 'day');
        progreso = totalDias > 0 ? Math.min((diasPasados / totalDias) * 100, 100) : 100;
        progreso = Math.round(progreso);
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full sm:max-w-sm mx-auto hover:shadow-lg transition-all space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
                {sowing.name}
            </h3>
            <p className="font-bold">{sowing.pond.name}</p>

            <p className="text-sm text-gray-500">Progreso hacia la fecha estimada</p>

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
                Ver información del cosecha
            </Link>
        </div>
    );
}
