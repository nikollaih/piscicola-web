import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import { useState } from 'react';
import AlertMessage from '@/Components/AlertMessage';
import ConfigTime from './Partials/ConfigTime';
import ConfigVariable from './Partials/ConfigVariable';

export default function ConfigActuator({ auth, formActionUrl, formActionDeleteUrl, automationVariable, actuator, automation, steps }) {
    const [successMessage, setSuccessMessage] = useState('');

    const onSuccessSubmit = () => {
        setSuccessMessage('Configuración cambiada satisfactoriamente');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configurar actuador</h2>}
        >
            <Head title="Configurar Actuador" />
            <div className="max-w-7xl mx-auto sm:px-4 lg:px-4 pt-4 lg:pt-12">
                <AlertMessage
                    title={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto gap-x-4 gap-y-6 sm:px-4 lg:px-4">
                <ConfigTime
                    formActionUrl={formActionUrl}
                    formActionDeleteUrl={formActionDeleteUrl}
                    automation={automation}
                    actuator={actuator}
                    onSuccess={onSuccessSubmit}
                />
                <ConfigVariable
                    formActionUrl={formActionUrl}
                    formActionDeleteUrl={formActionDeleteUrl}
                    automation={automationVariable}
                    actuator={actuator}
                    steps={steps}
                    onSuccess={onSuccessSubmit}
                />
            </div>
        </AuthenticatedLayout>
    );
}
