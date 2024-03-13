import {Link, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import {useEffect, useState, useRef} from "react";

export default function PartyForm({ partyRoleId, party }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;
    const { data, setData, post, patch, reset, setDefaults, processing } = useForm({
        document: null,
        name: '',
        mobile_phone: null,
        home_phone: null,
        office_phone: null,
        email: '',
        notes: '',
        party_role_id: partyRoleId
    });

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if(party?.id){
            setPartyData(party);
        }
    }, [])

    const setPartyData = (party) => {
        setData({
            document: party.document,
            name: party.name,
            mobile_phone: party.mobile_phone,
            home_phone: party.home_phone,
            office_phone: party.office_phone,
            email: party.email,
            notes: party.notes,
            party_role_id: party.party_role_id
        });
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.party?.id){
            patch(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit()
            });
        }
        else {
            post(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit(),
            });
        }
    }

    const onSuccessSubmit = () => {
        let successAction = "modificada";
        if(!pageProps?.party?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the user
        setSuccessMessage('La persona fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    return (
            <form onSubmit={handleSubmit}>
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <AlertMessage
                        title={successMessage}
                        onClose={() => setSuccessMessage('')}
                    />
                    <div class="bg-white shadow-sm sm:rounded-lg p-5">
                        <div className="grid grid-cols-3 gap-4 xs:grid-cols-1 mb-4">
                            <div className="w-full">
                                <InputLabel value="Documento"/>
                                <TextInput
                                    type="number"
                                    className="w-full"
                                    placeholder="123456789"
                                    name="document"
                                    value={data.document}
                                    onChange={(e) => setData(e.target.name, e.target.value)}/>
                                {(hasErrors?.document) ? <InputError message={hasErrors.document}/> : ""}
                            </div>
                            <div className="col-span-2">
                                <InputLabel value="Nombre completo"/>
                                <TextInput
                                    type="text"
                                    name="name"
                                    className="w-full"
                                    value={data.name}
                                    onChange={(e) => setData(e.target.name, e.target.value.toUpperCase())}/>
                                {(hasErrors?.name) ? <InputError message={hasErrors.name}/> : ""}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 xs:grid-cols-1 mb-4">
                            <div className="w-full">
                                <InputLabel value="Celular"/>
                                <TextInput
                                    type="number"
                                    name="mobile_phone"
                                    className="w-full"
                                    placeholder="123456789"
                                    value={data.mobile_phone}
                                    onChange={(e) => setData(e.target.name, e.target.value)}/>
                                {(hasErrors?.mobile_phone) ? <InputError message={hasErrors.mobile_phone}/> : ""}
                            </div>
                            <div>
                                <InputLabel value="Teléfono casa (Opcional)"/>
                                <TextInput
                                    type="number"
                                    name="home_phone"
                                    className="w-full"
                                    placeholder="123456789"
                                    value={data.home_phone}
                                    onChange={(e) => setData(e.target.name, e.target.value)}/>
                            </div>
                            <div>
                                <InputLabel value="Teléfono oficina (Opcional)"/>
                                <TextInput
                                    type="number"
                                    name="office_phone"
                                    className="w-full"
                                    placeholder="123456789"
                                    value={data.office_phone}
                                    onChange={(e) => setData(e.target.name, e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 xs:grid-cols-1 mb-4">
                            <div className="w-full col-span-3">
                                <InputLabel value="Correo electrónico"/>
                                <TextInput
                                    type="email"
                                    name="email"
                                    className="w-full"
                                    placeholder="johndoe@example.com"
                                    value={data.email}
                                    onChange={(e) => setData(e.target.name, e.target.value)}/>
                                {(hasErrors?.email) ? <InputError message={hasErrors.email}/> : ""}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                            <InputLabel value="Notas (Opcional)"/>
                            <textarea
                                onChange={(e) => setData(e.target.name, e.target.value)}
                                name="notes"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                cols="30"
                                rows="5"
                                value={data.notes}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 justify-end mt-4">
                        <Link href={route('parties', {partyRoleId: partyRoleId})}>
                            <PrimaryButton className="gray bg-gray-800">Regresar</PrimaryButton>
                        </Link>
                        <PrimaryButton
                            className="bg-orange-500"
                            disabled={processing}
                        >
                            Guardar
                        </PrimaryButton>
                        <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                    </div>
                </div>
            </form>
    );
}
