import {useEffect, useRef} from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

const municipalityToUser = {
    'text3872-1': "piscicolaquimbaya@gmail.com",
    'text3872-4': "piscicolafilandia@gmail.com",
};

export default function Login({ status, canResetPassword, expo_token }) {
    const containerRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        device_token: ''
    });

    useEffect(() => {
        setData('device_token', expo_token)
    }, [expo_token]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    useEffect(() => {
        const svgPath = '/images/m_quindio.svg'; // Laravel sirve "resources/images" desde "public" después del build

        fetch(svgPath)
            .then((res) => res.text())
            .then((svg) => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;

                    // agregar eventos de click a cada municipio
                    Object.keys(municipalityToUser).forEach((id) => {
                        const el = containerRef.current.querySelector(`#${id}`);
                        if (el) {
                            el.style.cursor = 'pointer';
                            el.addEventListener('click', () => {
                                const username = municipalityToUser[id];
                                setData('email', `${username}`);
                            });
                        }
                    });
                }
            });
    }, [setData]);

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión"/>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                <div className="w-full hidden xl:block" ref={containerRef} aria-hidden/>
                <div className="w-full px-6 py-6 lg:px-24 xl:px-6 xl:pt-10">
                    <div className={'p-4 bg-white md:shadow-md overflow-hidden rounded-lg avoid-background'}>
                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email"/>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2"/>
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Contraseña"/>

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2"/>
                            </div>

                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-gray-600">Recuerdame</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}

                                <PrimaryButton className="ms-4 bg-orange-600" disabled={processing}>
                                    Iniciar sesión
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </GuestLayout>
    );
}
