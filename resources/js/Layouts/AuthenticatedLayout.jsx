import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import UQ from '@/../images/uq.png'
import GQ from '@/../images/gq.png'
import SR from '@/../images/SR.png'

export default function Authenticated({ user, header, children }) {
    console.log(user)
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const partyRoleId = route().params.partyRoleId;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800"/>
                                </Link>
                            </div>
                            <div className="hidden space-x-2 sm:-my-px sm:ms-10 md:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Inicio
                                </NavLink>
                            </div>
                            {
                                (user.role_id === 1) ?
                                    <div className="flex">
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('associations')}
                                                     active={route().current('associations')}>
                                                Asociaciones
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('productive_units')}
                                                     active={route().current('productive_units')}>
                                                Unidades productivas
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('steps')}
                                                     active={route().current('steps')}>
                                                Etapas
                                            </NavLink>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex">
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('sowings')} active={route().current('sowings')}>
                                                Cosechas
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('actuators')} active={route().current('actuators')}>
                                                Actuadores
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('ponds')} active={route().current('ponds')}>
                                                Estanques
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('expenses')} active={route().current('expenses')}>
                                                Gastos
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('sales')} active={route().current('sales')}>
                                                Ventas
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('supplies')} active={route().current('supplies')}>
                                                Suministros
                                            </NavLink>
                                        </div>
                                        <div className="hidden md:flex sm:items-center">
                                            <div className="relative">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                        >
                                                            Personas
                                                            <svg
                                                                className="ms-2 -me-0.5 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content>
                                                        <Dropdown.Link href={route('users')}
                                                                       active={route().current('users')}>Usuarios</Dropdown.Link>
                                                        <Dropdown.Link href={route('parties', {partyRoleId: 1})}
                                                                       active={(route().current('parties') || route().current('party.create')) && partyRoleId == 1}>Clientes</Dropdown.Link>
                                                        <Dropdown.Link href={route('parties', {partyRoleId: 2})}
                                                                       active={(route().current('parties') || route().current('party.create')) && partyRoleId == 2}>Empleados</Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 md:flex">
                                            <NavLink href={route('reports')} active={route().current('reports')}>
                                                Reportes
                                            </NavLink>
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className="hidden md:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Cerrar sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden bg-white w-full h-full z-10'}>
                    <div className="pt-2 pb-3 space-y-1 overflow-y-auto">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Inicio
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('sowings')} active={route().current('sowings')}>
                            Cosechas
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('actuators')} active={route().current('actuators')}>
                            Actuadores
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('ponds')} active={route().current('ponds')}>
                            Estanques
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('expenses')} active={route().current('expenses')}>
                            Gastos
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('sales')} active={route().current('sales')}>
                            Ventas
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('supplies')} active={route().current('supplies')}>
                            Suministros
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('users')} active={route().current('users')}>
                            Usuarios
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('parties', {partyRoleId: 1})} active={(route().current('parties') || route().current('party.create')) && partyRoleId === "1"}>
                            Clientes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('parties', {partyRoleId: 2})} active={(route().current('parties') || route().current('party.create')) && partyRoleId === "2"}>
                            Empleados
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-4">{header}</div>
                </header>
            )}

            <main className="flex-1 p-2 pb-36 sm:p-2 md:p-0">{children}</main>
            <footer
                className="hidden md:fixed bottom-0 right-0 left-0 bg-white p-4 items-center justify-center align-middle md:flex gap-6 shadow-md">
                <img src={UQ} alt="" width={50} className="mx-6"/>
                <img src={GQ} alt="" width={100} style={{marginTop: -15}} className="mx-6"/>
                <img src={SR} alt="" width={160} className="mx-6"/>
            </footer>
        </div>
    );
}
