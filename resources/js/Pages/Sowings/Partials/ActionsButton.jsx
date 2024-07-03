import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {Link} from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ActionsButton({sowing}) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    className="h-11 sm:h-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 focus:ring-offset-2 transition ease-in-out duration-150 ${">
                    Acciones
                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                         aria-hidden="true">
                        <path fill-rule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clip-rule="evenodd"/>
                    </svg>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-2">
                        <Menu.Item>
                            <Link href={route('sowing_news', {sowingId: sowing.id})} className="">
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Actividad</p>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={route('feeding', {sowingId: sowing.id})}>
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Alimentación</p>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={route('medicate', {sowingId: sowing.id})}>
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Medicamentos</p>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={route('biomasses', {sowingId: sowing.id})}>
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Biomasas</p>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={route('mortalities', {sowingId: sowing.id})}>
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Mortalidad</p>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={route('expenses', {sowingId: sowing.id})}>
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Gastos</p>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={route('sowing.resume', {sowingId: sowing.id})}>
                                <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Resumen financiaro</p>
                            </Link>
                        </Menu.Item>
                        {
                            (!sowing.sale_date && !sowing.sale) ?
                                <Menu.Item>
                                    <Link href={route('sale.create', {sowingId: sowing.id})}>
                                        <p className="text-gray-700 block px-4 py-2 hover:bg-gray-50 cursor-pointer">Vender</p>
                                    </Link>
                                </Menu.Item> : null
                        }

                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
