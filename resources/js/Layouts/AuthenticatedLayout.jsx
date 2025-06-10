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
                            <div className="hidden space-x-2 sm:-my-px sm:ms-10 lg:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Resumen
                                </NavLink>
                            </div>
                            {
                                (user.role_id === 1) ?
                                    <div className="flex">
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 lg:flex">
                                            <NavLink href={route('associations')}
                                                     active={route().current('associations')}>
                                                Asociaciones
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 lg:flex">
                                            <NavLink href={route('productive_units')}
                                                     active={route().current('productive_units')}>
                                                Unidades productivas
                                            </NavLink>
                                        </div>
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 lg:flex">
                                            <NavLink href={route('steps')}
                                                     active={route().current('steps')}>
                                                Etapas
                                            </NavLink>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex">
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 lg:flex">
                                            <NavLink href={route('sowings')} active={route().current('sowings')}>
                                                Cosechas
                                            </NavLink>
                                        </div>

                                        <div className="hidden lg:flex sm:items-center">
                                            <div className="relative">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button
                                                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
                                                        >
                                                            Infraestructura
                                                            <svg
                                                                className="ml-1 h-4 w-4 fill-current"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M5.5 7l4.5 4 4.5-4H5.5z" />
                                                            </svg>
                                                        </button>
                                                    </Dropdown.Trigger>

                                                    <Dropdown.Content>
                                                        <Dropdown.Link href={route('actuators')} active={route().current('actuators')}>
                                                            Actuadores
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('ponds')} active={route().current('ponds')}>
                                                            Estanques
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('supplies')} active={route().current('supplies')}>
                                                            Suministros
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        </div>

                                        <div className="hidden lg:flex sm:items-center">
                                            <div className="relative">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button
                                                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
                                                        >
                                                            Finanzas
                                                            <svg
                                                                className="ml-1 h-4 w-4 fill-current"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M5.5 7l4.5 4 4.5-4H5.5z" />
                                                            </svg>
                                                        </button>
                                                    </Dropdown.Trigger>

                                                    <Dropdown.Content>
                                                        <Dropdown.Link href={route('expenses')} active={route().current('expenses')}>
                                                            Gastos
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('sales')} active={route().current('sales')}>
                                                            Ventas
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className="hidden lg:flex sm:items-center">
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
                                        <div className="hidden space-x-2 sm:-my-px sm:ms-2 lg:flex">
                                            <NavLink href={route('reports')} active={route().current('reports')}>
                                                Reportes
                                            </NavLink>
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className="hidden lg:flex sm:items-center sm:ms-6">
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

                        <div className="-me-2 flex items-center lg:hidden">
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

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' lg:hidden bg-white w-full h-full z-10'}>
                    <div className="pt-2 pb-3 space-y-1 overflow-y-auto">
                        <ResponsiveNavLink href={route('dashboard')} active={(route().current('dashboard') || route().current('first'))}>
                            Resumen
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('sowings')} active={(route().current('sowings') || route().current('first'))}>
                            Cosechas
                        </ResponsiveNavLink>
                        
                        
                        
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    className="flex items-center px-3 py-2 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
                                >
                                    Infraestructura
                                    <svg
                                        className="ml-1 h-4 w-4 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M5.5 7l4.5 4 4.5-4H5.5z" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content clas>
                                <Dropdown.Link href={route('actuators')} active={route().current('actuators')}>
                                    Actuadores
                                </Dropdown.Link>
                                <Dropdown.Link href={route('ponds')} active={route().current('ponds')}>
                                    Estanques
                                </Dropdown.Link>
                                <Dropdown.Link href={route('supplies')} active={route().current('supplies')}>
                                    Suministros
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    className="flex items-center px-3 py-2 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
                                >
                                    Finanzas
                                    <svg
                                        className="ml-1 h-4 w-4 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M5.5 7l4.5 4 4.5-4H5.5z" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content clas>
                                <Dropdown.Link href={route('expenses')} active={route().current('expenses')}>
                                    Gastos
                                </Dropdown.Link>
                                <Dropdown.Link href={route('sales')} active={route().current('sales')}>
                                    Ventas
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>


                        

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    className="flex items-center px-3 py-2 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
                                >
                                    Personas
                                    <svg
                                        className="ml-1 h-4 w-4 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M5.5 7l4.5 4 4.5-4H5.5z" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('users')} active={route().current('users')}>
                                    Usuarios
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('parties', { partyRoleId: 1 })}
                                    active={(route().current('parties') || route().current('party.create')) && partyRoleId === "1"}
                                >
                                    Clientes
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('parties', { partyRoleId: 2 })}
                                    active={(route().current('parties') || route().current('party.create')) && partyRoleId === "2"}
                                >
                                    Empleados
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>

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
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-4 flex">
                        {(!route().current('dashboard') && !route().current('sowings') && !route().current('first')) ?
                            <button className="mr-3 lg:hidden" onClick={() => history.back()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5"
                                     stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M15.75 19.5 8.25 12l7.5-7.5"/>
                                </svg>
                            </button> : null}

                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1 p-2 pb-0 md:pb-40">{children}</main>
            <footer
                className="hidden md:fixed md:block bottom-0 right-0 left-0 bg-white p-4 shadow-md">
                <div className="items-center flex justify-center align-middle mt-2 gap-6 ">
                    <img src={UQ} alt="" width={40} className="mx-6"/>
                    <img src={GQ} alt="" width={80} style={{marginTop: -15}} className="mx-6"/>
                    <img src={SR} alt="" width={120} className="mx-6"/>
                </div>
            </footer>
        </div>
    );
}
