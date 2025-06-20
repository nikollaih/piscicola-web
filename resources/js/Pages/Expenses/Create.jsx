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
import TextArea from "@/Components/TextArea.jsx";

export default function CreateExpense({ auth, expensesUrl, expenseCategories }) {
    // Create a ref for the reset button
    const buttonResetRef = useRef(null);
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing } = useForm({
        cost: null,
        category_id: null,
        concept: "",
        notes: "",
        manual_created_at: moment().format(Constants.DATEFORMAT)
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('Seleccionar');

    useEffect(() => {
        if(pageProps?.expense?.id){
            setExpenseData(pageProps.expense);
        }
    }, [])

    const setExpenseData = (expense) => {
        setData({
            cost: expense.cost,
            category_id: expense.category_id,
            concept: expense.concept,
            notes: expense.notes,
            manual_created_at: moment(expense.manual_created_at).format(Constants.DATEFORMAT)
        });

        setCategoryTitle(expense.category.name)
    }

    // Handle the form submition
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the form data to be processed
        if(pageProps?.expense?.id){
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
        if(!pageProps?.expense?.id) {
            // Reset the form...
            reset();
            successAction = "agregado";
        }
        // Set the success message to be displayed to the expense
        setSuccessMessage('El gasto fue '+successAction+' satisfactoriamente');
        // Clear the form
        buttonResetRef.current.click();
    }

    const getCategoryDropdownDom = () => {
        return expenseCategories.map((item) => {
            return <DropDownItem onClick={() => {setSelectedCategory(item)}}>{item.name}</DropDownItem>
        })
    }

    const setSelectedCategory = (expenseCategory) => {
        setCategoryTitle(expenseCategory.name);
        setData({...data, category_id: expenseCategory.id});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Gasto" />
            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="p-6">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Gastos</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Crear un Gasto
                                </h2>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                            <AlertMessage
                                title={successMessage}
                                onClose={() => setSuccessMessage('')}
                            />

                            <div class="bg-white shadow-sm rounded-lg p-5">
                                <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4 xs:grid-cols-1 mb-4">
                                    <div className="md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Categoria"/>
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <DropDownToggle
                                                    className="items-center cursor-pointer">{categoryTitle}</DropDownToggle>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="left" className="px-2" width={100}>
                                                {getCategoryDropdownDom()}
                                            </Dropdown.Content>
                                        </Dropdown>
                                        {(hasErrors?.category_id) ?
                                            <InputError message={hasErrors.category_id}/> : ""}
                                    </div>
                                    <div className="w-full md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Concepto"/>
                                        <TextInput
                                            type="text"
                                            className="w-full"
                                            placeholder=""
                                            name="concept"
                                            value={data.concept}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.concept) ?
                                            <InputError message={hasErrors.concept}/> : ""}
                                    </div>
                                    <div className="w-full md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Valor"/>
                                        <TextInput
                                            type="number"
                                            className="w-full"
                                            placeholder="$"
                                            name="cost"
                                            value={data.cost}
                                            required
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.cost) ?
                                            <InputError message={hasErrors.cost}/> : ""}
                                    </div>
                                    <div className="w-full md:col-span-2 sm:col-span-4">
                                        <InputLabel value="Fecha del gasto"/>
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
                                    <div className="w-full md:col-span-4 sm:col-span-4">
                                        <InputLabel value="Notas"/>
                                        <TextArea
                                            className="w-full"
                                            placeholder=""
                                            name="notes"
                                            value={data.notes}
                                            onChange={(e) => setData(e.target.name, e.target.value)}/>
                                        {(hasErrors?.notes) ?
                                            <InputError message={hasErrors.notes}/> : ""}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-end mt-4">
                                <Link className="w-full sm:w-auto" href={expensesUrl}>
                                    <PrimaryButton className="gray bg-gray-800 w-full sm:w-auto text-white">Regresar</PrimaryButton>
                                </Link>
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
            </div>
        </AuthenticatedLayout>
    );
}
