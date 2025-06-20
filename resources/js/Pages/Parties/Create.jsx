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
        >
            <Head title={pageTitle} />
            <div className="py-4 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Clientes</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {pageTitle}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <PartyForm auth={auth} party={party}  partyRoleId={partyRoleId} formActionUrl={formActionUrl}/>
            </div>
        </AuthenticatedLayout>
    );
}
