import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Menu } from '@headlessui/react';

const tabs = [
    { name: 'Indicadores', routeName: 'sowing.view' },
    { name: 'Alimentación', routeName: 'feeding' },
    { name: 'Medicamentos', routeName: 'medicate' },
    { name: 'Biomasas', routeName: 'biomasses' },
    { name: 'Mortalidad', routeName: 'mortalities' },
    { name: 'Actividad', routeName: 'sowing_news' },
];

export default function ActionsButton({ sowing }) {
    return (
        <div className="mb-6 overflow-x-auto">
            {/* Vista de PC */}
            <div className="hidden sm:flex gap-4 border-b border-gray-200">
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

            {/* Vista móvil */}
            <div className="sm:hidden reative">
                <Menu as="div" className="relative inline-block w-full">
                    <Menu.Button className="w-full px-4 py-2 bg-gray-200 rounded-md text-left">
                        Selecciona una acción
                    </Menu.Button>
                    <Menu.Items className="relative left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {tabs.map((tab) => {
                            const isActive = route().current(tab.routeName);
                            return (
                                <Menu.Item key={tab.routeName}>
                                    {({ active }) => (
                                        <Link
                                            href={route(tab.routeName, { sowingId: sowing.id })}
                                            className={`block px-4 py-2 text-sm ${
                                                isActive
                                                    ? 'bg-[#6B7280] text-white'
                                                    : active
                                                    ? 'bg-gray-100'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {tab.name}
                                        </Link>
                                    )}
                                </Menu.Item>
                            );
                        })}
                    </Menu.Items>
                </Menu>
            </div>
        </div>
    );
}
