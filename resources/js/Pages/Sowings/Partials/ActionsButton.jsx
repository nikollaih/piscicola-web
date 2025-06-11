import { Link } from '@inertiajs/react';

const tabs = [
    { name: 'Indicadores', routeName: 'sowing.view' },
    { name: 'Alimentación', routeName: 'feeding' },
    { name: 'Medicamentos', routeName: 'medicate' },
    { name: 'Biomasas', routeName: 'biomasses' },
    { name: 'Mortalidad', routeName: 'mortalities' },
    { name: 'Actividad', routeName: 'sowing_news' },
    // { name: 'Gastos', routeName: 'expenses' },
    // { name: 'Resumen financiero', routeName: 'sowing.resume' },
];

export default function ActionsButton({ sowing }) {
    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex gap-4 border-b border-gray-200">
                {tabs.map((tab) => {
                    const isActive = route().current(tab.routeName);
                    return (
                        <Link
                            key={tab.routeName}
                            href={route(tab.routeName, { sowingId: sowing.id })}
                            className={`px-4 py-1.5 rounded-md rounded-b-none text-sm font-medium whitespace-nowrap transition ${
                                isActive
                                    ? 'bg-[#6B7280] text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
