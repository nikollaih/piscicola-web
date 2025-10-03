import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from '@/Components/InputLabel.jsx';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from '@/Components/InputError.jsx';
import AlertMessage from '@/Components/AlertMessage.jsx';
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import TextArea from "@/Components/TextArea.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import DropDownToggle from "@/Components/DropDownToggle.jsx";
import DropDownItem from "@/Components/DropDownItem.jsx";

const DATETIME_FMT = 'YYYY-MM-DDTHH:mm';

export default function CreateMaintenance({ auth, devices }) {
    const buttonResetRef = useRef(null);
    const evidenceRef = useRef(null); // para limpiar el file input visualmente
    const hasErrors = usePage().props.errors;
    const pageProps = usePage().props;

    const { data, setData, post, patch, reset, processing, put } = useForm({
        device_id: '',
        operator_name: '',
        observations: '',
        evidence: null, // un solo archivo (File)
        maintenance_at: moment().format(DATETIME_FMT),
        next_maintenance_at: moment().add(30, 'days').format(DATETIME_FMT),
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [sensorName, setSelectedSensorName] = useState({id: '', name: 'Seleccionar'});

    useEffect(() => {
        if (pageProps?.maintenance?.id) {
            setMaintenanceData(pageProps.maintenance);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(sensorName?.maintenance_period && sensorName?.id){
            setData({
                ...data,
                device_id: sensorName?.id,
                next_maintenance_at: moment().add(sensorName?.maintenance_period, 'days').format(DATETIME_FMT),
            })
        }
    }, [sensorName]);

    const setMaintenanceData = (maintenance) => {
        setData({
            device_id: maintenance?.device_id, // aseguramos que venga de props
            operator_name: maintenance?.operator_name ?? '',
            observations: maintenance?.observations ?? '',
            evidence: null, // nunca setear rutas/strings aquí
            maintenance_at: maintenance?.maintenance_at
                ? moment(maintenance.maintenance_at).format(DATETIME_FMT)
                : moment().format(DATETIME_FMT),
            next_maintenance_at: maintenance?.next_maintenance_at
                ? moment(maintenance.next_maintenance_at).format(DATETIME_FMT)
                : moment().add(15, 'days').format(DATETIME_FMT),
        });

        // limpiar visualmente input file si existiera
        if (evidenceRef.current) evidenceRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pageProps?.maintenance?.id) {
            router.post(route('sensorMaintenance.update', pageProps?.maintenance?.id), { ...data, _method: 'PUT' }, {
                forceFormData: true,
                onSuccess: () => onSuccessSubmit(),
            });
        } else {
            post(pageProps.formActionUrl, {
                // Si hay un File en data o activamos esto, Inertia envía multipart/form-data
                forceFormData: true,
                onSuccess: () => onSuccessSubmit(),
            });
        }
    };

    const onSuccessSubmit = () => {
        let successAction = "modificado";
        if (!pageProps?.maintenance?.id) {
            reset(); // limpia el estado del useForm
            successAction = "agregado";
        }
        // limpiar input file visualmente
        if (evidenceRef.current) evidenceRef.current.value = '';
        setSuccessMessage('El mantenimiento fue ' + successAction + ' satisfactoriamente');
    };

    const getSensorDropdownDom = () => {
        return devices?.data?.map((item) => {
            return <DropDownItem onClick={() => {setSelectedSensorName(item)}}>{item.name}</DropDownItem>
        })
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Registrar Mantenimiento" />
            <div className="py-4 lg:py-6 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-4">
                    <div className="p-0">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Estanque</p>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Mantenimiento de sensores
                                </h2>
                            </div>
                        </div>
                    </div>

                    <AlertMessage
                        title={successMessage}
                        onClose={() => setSuccessMessage('')}
                    />

                    <div className="bg-white shadow-sm rounded-lg p-5 mb-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-4">
                                <div className="">
                                    <InputLabel value="Sensor y/o dispositivo"/>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <DropDownToggle
                                                className="items-center cursor-pointer">{sensorName?.name}</DropDownToggle>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" className="px-2" width={100}>
                                            {getSensorDropdownDom()}
                                        </Dropdown.Content>
                                    </Dropdown>
                                    {(hasErrors?.device_id) ?
                                        <InputError message={hasErrors.device_id}/> : ""}
                                </div>

                                <div>
                                    <InputLabel value="Encargado"/>
                                    <TextInput
                                        type="text"
                                        className="w-full"
                                        name="operator_name"
                                        placeholder={'John Doe'}
                                        value={data.operator_name}
                                        onChange={(e) => setData('operator_name', e.target.value)}
                                    />
                                    {hasErrors?.operator_name && (
                                        <InputError message={hasErrors.operator_name}/>
                                    )}
                                </div>

                                <div>
                                    <InputLabel value="Fecha y hora de mantenimiento"/>
                                    <TextInput
                                        type="datetime-local"
                                        className="w-full"
                                        name="maintenance_at"
                                        value={data.maintenance_at}
                                        required
                                        onChange={(e) => setData('maintenance_at', e.target.value)}
                                    />
                                    {hasErrors?.maintenance_at && (
                                        <InputError message={hasErrors.maintenance_at}/>
                                    )}
                                </div>

                                <div>
                                    <InputLabel value="Próxima fecha de mantenimiento"/>
                                    <TextInput
                                        type="datetime-local"
                                        className="w-full"
                                        name="next_maintenance_at"
                                        value={data.next_maintenance_at}
                                        required
                                        onChange={(e) => setData('next_maintenance_at', e.target.value)}
                                    />
                                    {hasErrors?.next_maintenance_at && (
                                        <InputError message={hasErrors.next_maintenance_at}/>
                                    )}
                                </div>

                                <div>
                                    <InputLabel value="Evidencia"/>
                                    {/* Usamos input nativo para evitar que TextInput inyecte value */}
                                    <input
                                        ref={evidenceRef}
                                        type="file"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        name="evidence"
                                        // multiple // descomenta si quieres permitir varios
                                        onChange={(e) => {
                                            const {files} = e.target;
                                            // un solo archivo:
                                            setData('evidence', files && files.length ? files[0] : null);
                                            // para varios archivos (si activas multiple):
                                            // setData('evidence', Array.from(files || []));
                                        }}
                                    />
                                    {hasErrors?.evidence && (
                                        <InputError message={hasErrors.evidence}/>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel value="Observaciones"/>
                                    <TextArea
                                        className="w-full"
                                        name="observations"
                                        value={data.observations}
                                        onChange={(e) => setData('observations', e.target.value)}
                                    />
                                    {hasErrors?.observations && (
                                        <InputError message={hasErrors.observations}/>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end mt-4">
                                <Link href={route('sensorMaintenances')}>
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
        </AuthenticatedLayout>
    );
}
