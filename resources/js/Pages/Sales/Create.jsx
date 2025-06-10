import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import DropDownItem from '@/Components/DropDownItem.jsx';
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import { useEffect, useState, useRef } from "react";
import Constants from "../../../Constants.js";
import moment from "moment";

export default function CreateSale({ auth, clients, sowings }) {
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        sowing_id: null,
        client_id: null,
        unit_cost: '',
        total_weight: '',
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [clientsTitle, setClientTitle] = useState('Seleccionar cliente');
    const [sowingTitle, setSowingTitle] = useState('Seleccionar cosecha');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (pageProps?.sale?.id) {
            setSaleData(pageProps.sale);
        }
    }, []);

    const setSaleData = (sale) => {
        setData({
            sowing_id: sale.sowing_id,
            client_id: sale.client_id,
            unit_cost: sale.unit_cost,
            total_weight: sale.total_weight,
            manual_created_at: moment(sale.manual_created_at).format(Constants.DATEFORMAT)
        });

        setTotalPrice(sale.unit_cost * sale.total_weight);

        const selectedClient = clients.data.find(c => c.id === sale.client_id);
        const selectedSowing = sowings.find(s => s.id === sale.sowing_id);

        setClientTitle(selectedClient ? selectedClient.name : 'Seleccionar cliente');
        setSowingTitle(selectedSowing ? selectedSowing.name : 'Seleccionar cosecha');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pageProps?.sale?.id) {
            patch(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit()
            });
        } else {
            post(pageProps.formActionUrl, {
                onSuccess: () => onSuccessSubmit()
            });
        }
    }

    const onSuccessSubmit = () => {
        let successAction = "modificada";
        if (!pageProps?.sale?.id) {
            reset();
            successAction = "agregada";
        }
        setSuccessMessage('La venta fue ' + successAction + ' satisfactoriamente');

        setTimeout(() => {
            router.visit(route('sales'));
        }, 1500);
    }

    const getClientsDropdown = () => {
        return clients.data.map((item) => (
            <DropDownItem key={item.id} onClick={() => setSelectedClient(item)}>
                {item.name}
            </DropDownItem>
        ));
    }

    const getSowingsDropdown = () => {
        return sowings.map((item) => (
            <DropDownItem key={item.id} onClick={() => setSelectedSowing(item)}>
                {item.name}
            </DropDownItem>
        ));
    }

    const setSelectedClient = (client) => {
        setClientTitle(client.name);
        setData({ ...data, client_id: client.id });
    }

    const setSelectedSowing = (sowing) => {
        setSowingTitle(sowing.name);
        setData({ ...data, sowing_id: sowing.id });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Registrar Venta" />
            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <div className="p-6">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Ventas</p>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Crear una Venta
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="bg-white shadow-sm rounded-lg p-5 mb-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-4">
                                    <div>
                                        <InputLabel value="Cosecha" />
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle className="items-center cursor-pointer">
                                                    {sowingTitle}
                                                </DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getSowingsDropdown()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {hasErrors?.sowing_id && (
                                            <InputError message={hasErrors.sowing_id} />
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel value="Cliente" />
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle className="items-center cursor-pointer">
                                                    {clientsTitle}
                                                </DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getClientsDropdown()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {hasErrors?.client_id && (
                                            <InputError message={hasErrors.client_id} />
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel value="Fecha de venta" />
                                        <TextInput
                                            type="date"
                                            className="w-full"
                                            name="manual_created_at"
                                            value={data.manual_created_at}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}
                                        />
                                        {hasErrors?.manual_created_at && (
                                            <InputError message={hasErrors.manual_created_at} />
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel value="Precio unitario" />
                                        <TextInput
                                            type="number"
                                            className="w-full"
                                            name="unit_cost"
                                            value={data.unit_cost}
                                            required
                                            onChange={(e) => {
                                                setData(e.target.name, e.target.value);
                                                setTotalPrice(parseFloat(e.target.value || 0) * parseFloat(data.total_weight || 0));
                                            }}
                                        />
                                        {hasErrors?.unit_cost && (
                                            <InputError message={hasErrors.unit_cost} />
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel value="Peso total" />
                                        <TextInput
                                            type="number"
                                            className="w-full"
                                            name="total_weight"
                                            value={data.total_weight}
                                            onChange={(e) => {
                                                setData(e.target.name, e.target.value);
                                                setTotalPrice(parseFloat(data.unit_cost || 0) * parseFloat(e.target.value || 0));
                                            }}
                                        />
                                        {hasErrors?.total_weight && (
                                            <InputError message={hasErrors.total_weight} />
                                        )}
                                    </div>
                                </div>

                                <p className="text-right text-lg">
                                    La cosecha {(pageProps?.sale?.id) ? "fue vendida" : "será vendida"} por{" "}
                                    <span className="font-bold text-green-700">
                                        ${totalPrice.toLocaleString('es-CO')}
                                    </span>
                                </p>

                                <div className="flex gap-4 justify-end mt-4">
                                    <Link href={route('sales')}>
                                        <PrimaryButton className="gray bg-gray-800 text-white">
                                            Regresar
                                        </PrimaryButton>
                                    </Link>
                                    <PrimaryButton
                                        type="submit"
                                        className="bg-orange-600 text-white"
                                        disabled={processing}
                                    >
                                        Guardar
                                    </PrimaryButton>
                                    <button type="reset" className="hidden" ref={buttonResetRef}>
                                        reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
