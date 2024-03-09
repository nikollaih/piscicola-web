import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import {useEffect} from "react";
import PartyForm from '@/Pages/Parties/Partials/PartyForm.jsx'

export default function CreateParty({ auth, states, partiesUrl }) {
    const pageProps = usePage().props;
    const pageTitle = ((pageProps?.party?.id) ? "Modificar " : "Agregar ") + 'cliente';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{pageTitle}</h2>}
        >
            <Head title={pageTitle} />
            <div className="py-12">
                <PartyForm auth={auth} states={states} partiesUrl={partiesUrl} />
            </div>
        </AuthenticatedLayout>
    );
}
