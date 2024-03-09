import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx'
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import {useEffect, useState, useRef} from "react";

export default function PartyForm({ auth, states, partiesUrl, roleId }) {
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
        city_id: null,
        notes: '',
        type: 1,
        role_id: roleId
    });
    const [stateTitle, setStateTitle] = useState('Seleccionar');
    const [cityTitle, setCityTitle] = useState('Seleccionar');
    const [typeTitle, setTypeTitle] = useState('Persona');
    const [successMessage, setSuccessMessage] = useState('');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if(pageProps?.party?.id){
            setClientData(pageProps.party);
        }
    }, [])

    const setClientData = (party) => {
        setData({
            document: party.document,
            name: party.name,
            mobile_phone: party.mobile_phone,
            home_phone: party.home_phone,
            office_phone: party.office_phone,
            email: party.email,
            city_id: party.city_id,
            notes: party.notes,
            type: party.type,
            role_id: party.role_id
        });

        getCities(party.city.state.id);
        setCityTitle(party.city.name);
        setStateTitle(party.city.state.name);
        setTypeTitle((party.type === 1) ? "Persona" : "Empresa");
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
        let successAction = "modificado";
        if(!pageProps?.party?.id) {
            // Reset the form...
            reset();
            // Set the state select title
            setStateTitle('Seleccionar');
            // Set the city dropdown title
            setCityTitle('Seleccionar');
            // Clear the cities
            setCities([]);
            successAction = "agregado";
        }
        // Set the success message to be displayed to the user
        setSuccessMessage('El cliente fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    // Return the states items to be included into the dropdown
    const getStatesDropdown = () => {
        return states.map((state) => {
            return <DropDownItem onClick={() => {setSelectedState(state)}}>{state.name}</DropDownItem>;
        })
    }

    // Set the selected state then it'll get the cities belongs to the state
    const setSelectedState = async (state) => {
        // Set the dropdown title
        setStateTitle(state.name);
        // Clear the cities dropdown title
        setCityTitle('Seleccionar');
        // Clear the selected city id
        setData({...data, city_id: null});
        // Get the cities belongs to the state
        await getCities(state.id);
    }

    const getCitiesDropdown = () => {
        return cities.map((city) => {
            return <DropDownItem onClick={() => {setSelectedCity(city)}}>{city.name}</DropDownItem>;
        })
    }

    // Get the cities belongs to a state
    const getCities = async (stateId) => {
        let params = {'state': stateId};
        let response = await fetch(route('get.cities', params));
        let cities = await response.json();
        setCities(cities.cities);
    }

    const setSelectedCity = (city) => {
        setData({...data, city_id: city.id});
        setCityTitle(city.name);
    }

    const setSelectedType = (type) => {
        setData({...data, type: type.id});
        setTypeTitle(type.name);
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
                            <div>
                                <InputLabel value="Tipo"/>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <DropDownToggle className="items-center cursor-pointer">{typeTitle}</DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2">
                                        <DropDownItem onClick={() => {setSelectedType({id: 1, name: "Persona"})}}>Persona</DropDownItem>
                                        <DropDownItem onClick={() => {setSelectedType({id: 2, name: "Empresa"})}}>Empresa</DropDownItem>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
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
                            <div className="">
                                <InputLabel value="Nombre / Razón Social"/>
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
                            <div className="w-full">
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
                            <div>
                                <InputLabel value="Departamento"/>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <DropDownToggle className="items-center cursor-pointer">{stateTitle}</DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2">
                                        {getStatesDropdown()}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                            <div>
                                <InputLabel value="Ciudad"/>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <DropDownToggle className="items-center cursor-pointer">{cityTitle}</DropDownToggle>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" className="px-2">
                                        {getCitiesDropdown()}
                                    </Dropdown.Content>
                                    {(hasErrors?.city_id) ? <InputError message={hasErrors.city_id}/> : ""}
                                </Dropdown>
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
                        <Link href={partiesUrl}>
                            <PrimaryButton className="gray bg-gray-800">Regresar</PrimaryButton>
                        </Link>
                        <PrimaryButton
                            className="bg-indigo-500"
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
