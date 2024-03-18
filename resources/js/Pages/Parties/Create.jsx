import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import PartyForm from '@/Pages/Parties/Partials/PartyForm.jsx'

export default function CreateParty({ auth, party, partyRoles, partyRoleId, formActionUrl }) {
    const pageProps = usePage().props;
    const getTitle = () => {
        return partyRoles.filter((role) => role.id == partyRoleId)[0].name;
    }

    const pageTitle = ((pageProps?.party?.id) ? "Modificar " : "Agregar ") + getTitle();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{pageTitle}</h2>}
        >
            <Head title={pageTitle} />
            <div className="py-12">
                <PartyForm auth={auth} party={party}  partyRoleId={partyRoleId} formActionUrl={formActionUrl}/>
            </div>
        </AuthenticatedLayout>
    );
}
