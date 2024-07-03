import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, useForm, usePage} from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx'
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import {useEffect, useState, useRef} from "react";
import Constants from "../../../Constants.js";
import moment from "moment";
import SowingInformation from "@/Pages/Sowings/Partials/SowingInformation.jsx";

export default function CreateSale({ auth, clients, sowing }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;
console.log(pageProps)
    const { data, setData, post, patch, reset, processing } = useForm({
        client_id: null,
        unit_cost: '',
        total_weight: '',
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [clientsTitle, setClientTitle] = useState('Seleccionar');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if(pageProps?.sale?.id){
            setSaleData(pageProps.sale);
        }
    }, [])

    const setSaleData = (sale) => {
        setData({
            client_id: sale.client_id,
            unit_cost: sale.unit_cost,
            total_weight: sale.total_weight,
            manual_created_at: moment(sale.manual_created_at).format(Constants.DATEFORMAT)
        });

        setTotalPrice(sale.unit_cost * sale.total_weight);
        setClientTitle(sale.client.name);
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.sale?.id){
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
        if(!pageProps?.sale?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the sale
        setSuccessMessage('La venta fue '+successAction+' satisfactoriamente');

        setTimeout(() => {
            router.visit(route('sowing.view', {sowingId: sowing.id}))
        }, 1500)
    }

    const getClientsDropdown = () => {
        return clients.data.map((item) => {
            return <DropDownItem onClick={() => {setSelectedClient(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedClient = (client) => {
        setClientTitle(client.name);
        setData({...data, client_id: client.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.sale?.id) ? "Modificar venta" : "Vender " + sowing.name}</h2>}
        >
            <Head title="Asociación" />
            <div className="py-4 lg:py-12">
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 ">
                            <div className="bg-white shadow-sm rounded-lg p-2 mb-4 md:mb-0">
                                <SowingInformation sowing={sowing}/>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white shadow-sm rounded-lg p-5 mb-6 col-span-2">
                                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                        <div className="md:col-span-1 sm:col-span-2">
                                            <InputLabel value="Cliente"/>
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <DropDownToggle
                                                        className="items-center cursor-pointer">{clientsTitle}</DropDownToggle>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align="left" className="px-2" width={100}>
                                                    {getClientsDropdown()}
                                                </Dropdown.Content>
                                            </Dropdown>
                                            {(hasErrors?.measurement_unit_id) ?
                                                <InputError message={hasErrors.measurement_unit_id}/> : ""}
                                        </div>
                                        <div className="w-full md:col-span-1 sm:col-span-2">
                                            <InputLabel value="Fecha de venta"/>
                                            <TextInput
                                                type="date"
                                                className="w-full"
                                                placeholder=""
                                                name="manual_created_at"
                                                value={data.manual_created_at}
                                                required
                                                onChange={(e) => setData(e.target.name, e.target.value)}/>
                                            {(hasErrors?.manual_created_at) ?
                                                <InputError message={hasErrors.manual_created_at}/> : ""}
                                        </div>
                                        <div className="w-full md:col-span-1 sm:col-span-2">
                                            <InputLabel value="Precio unitario"/>
                                            <TextInput
                                                type="number"
                                                className="w-full"
                                                placeholder=""
                                                name="unit_cost"
                                                value={data.unit_cost}
                                                required
                                                onChange={(e) => {
                                                    setData(e.target.name, e.target.value)
                                                    setTotalPrice(parseFloat(data.total_weight) * parseFloat(e.target.value))
                                                }}/>
                                            {(hasErrors?.unit_cost) ?
                                                <InputError message={hasErrors.unit_cost}/> : ""}
                                        </div>
                                        <div className="w-full md:col-span-1 sm:col-span-3">
                                            <InputLabel value="Peso total"/>
                                            <TextInput
                                                type="number"
                                                className="w-full"
                                                placeholder=""
                                                name="total_weight"
                                                value={data.total_weight}
                                                onChange={(e) => {
                                                    setData(e.target.name, e.target.value)
                                                    setTotalPrice(parseFloat(data.unit_cost) * parseFloat(e.target.value))
                                                }}/>
                                            {(hasErrors?.total_weight) ?
                                                <InputError message={hasErrors.total_weight}/> : ""}
                                        </div>
                                    </div>
                                    <p className="text-right text-lg">La
                                        cosecha {(pageProps?.sale?.id) ? "fue vendida " : "será vendida "} por <span
                                            className="font-bold text-green-700">${totalPrice.toLocaleString('es-CO')}</span>
                                    </p>
                                </div>
                            </form>
                        </div>


                        <div className="flex gap-4 justify-end mt-4">
                            <Link href={route('sales')}>
                                <PrimaryButton className="gray bg-gray-800">Regresar</PrimaryButton>
                            </Link>
                            <PrimaryButton
                                className="bg-orange-600"
                                disabled={processing}
                            >
                                Guardar
                            </PrimaryButton>
                            <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                        </div>
                    </div>
            </div>
        </AuthenticatedLayout>
    );
}
