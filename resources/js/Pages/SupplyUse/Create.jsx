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
import moment from "moment";
import Constants from "@/../Constants.js";

export default function CreateBiomasse({ auth, sowingId, biomasseId, supplies, indexRoute, buttonText, titleh2 }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        sowing_id: sowingId,
        biomasse_id: biomasseId,
        supply_id: null,
        quantity: null,
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [supplyTitle, setSupplyTitle] = useState('Seleccionar');

    useEffect(() => {
        if(pageProps?.feed?.id){
            setSowingData(pageProps.feed);
        }
    }, [])

    const setSowingData = (feed) => {
        setData({
            quantity: feed.quantity,
            supply_id: feed.supply_id,
            manual_created_at: moment(feed.manual_created_at).format(Constants.DATEFORMAT)
        });

        setSupplyTitle(`${feed.supply.name} - ${feed.supply.available_quantity}${feed.supply.measurement_unit.name}`);
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.feed?.id){
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
        if(!pageProps?.feed?.id) {
            // Reset the form...
            reset();
            successAction = "agregada";
        }
        // Set the success message to be displayed to the feed
        setSuccessMessage('El suministro fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getSupplyDropdownDom = () => {
        return supplies.map((item) => {
            return <DropDownItem onClick={() => {setSelectedSupply(item)}}>{item.name} - {item.available_quantity}{item.measurement_unit.name}</DropDownItem>
        })
    }

    const setSelectedSupply = (supply) => {
        setSupplyTitle(`${supply.name} - ${supply.available_quantity}${supply.measurement_unit.name}`);
        setData({...data, supply_id: supply.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{(pageProps?.feed?.id) ? "Modificar" : "Agregar"} Suministro</h2>}
        >
            <Head title="Biomasa" />
            <div className="py-4 sm:py-6">
                <form onSubmit={handleSubmit}>
                    <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                        <AlertMessage
                            title={successMessage}
                            onClose={() => setSuccessMessage('')}
                        />

                        <div className="">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                <div>
                                    <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                                <Link href="/sowings" className="hover:text-gray-700">Cosecha</Link>
                                                <span className="mx-2">{'>'}</span>
                                                <span className="text-gray-700">{titleh2}</span>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {buttonText}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link className="w-full sm:w-auto" href={indexRoute}>
                                <PrimaryButton className="bg-neutral-800">Regresar</PrimaryButton>
                            </Link>
                        </div>
                        <br />

                        <div className="bg-white shadow-sm rounded-lg p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                                <div className="md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Producto"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{supplyTitle}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getSupplyDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.supply_id) ? <InputError message={hasErrors.supply_id}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Cantidad"/>
                                    <TextInput
                                        type="number"
                                        className="w-full"
                                        placeholder=""
                                        name="quantity"
                                        value={data.quantity}
                                        required
                                        onChange={(e) => setData(e.target.name, e.target.value)}/>
                                    {(hasErrors?.quantity) ?
                                        <InputError message={hasErrors.quantity}/> : ""}
                                </div>
                                <div className="w-full md:col-span-1 sm:col-span-4">
                                    <InputLabel value="Fecha de alimentación"/>
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
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end mt-4">
                            <PrimaryButton
                                className="bg-orange-600 w-full sm:w-auto text-white"
                                disabled={processing}
                            >
                                Guardar
                            </PrimaryButton>
                            <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
