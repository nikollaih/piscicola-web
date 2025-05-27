import { useForm, usePage, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useEffect, useRef } from 'react';
import moment from 'moment';

export default function ConfigTime({ formActionUrl, formActionDeleteUrl, automation, actuator, onSuccess }) {
    const { errors } = usePage().props;
    const buttonResetRef = useRef(null);

    const form = useForm({
        start_time: "",
        end_time: "",
        automationType: "time"
    });

    const deleteForm = useForm({ valor: "off" });

    useEffect(() => {
        if (automation?.id) {
            form.setData({
                start_time: automation.start_time,
                end_time: automation.end_time,
                automationType: "time"
            });
        }
    }, [automation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(formActionUrl, {
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    const handleDelete = () => {
        router.post(formActionDeleteUrl, {
            ...deleteForm.data,
            automationType: 'time'
        }, {
            onSuccess: () => {
                onSuccess();
                deleteForm.reset();
                buttonResetRef.current.click();
            },
        });
    };

    const getMinutes = () => moment(form.data.end_time, 'HH:mm').diff(moment(form.data.start_time, 'HH:mm'), 'minutes');
    const getPrice = () => Number(getMinutes()) * actuator.cost_by_minute;

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-sm rounded-lg p-5">
                <h4 className="font-semibold">Automatización por tiempo</h4>
                <p className="mb-4">El actuador será encendido y apagado automáticamente todos los días a estas horas.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="w-full">
                        <InputLabel value="Hora de encendido"/>
                        <TextInput type="time" name="start_time" className="w-full" value={form.data.start_time} required
                                   onChange={(e) => form.setData('start_time', e.target.value)} />
                        <InputError message={errors.start_time} />
                    </div>
                    <div>
                        <InputLabel value="Hora de apagado"/>
                        <TextInput type="time" name="end_time" className="w-full" value={form.data.end_time} required
                                   onChange={(e) => form.setData('end_time', e.target.value)} />
                        <InputError message={errors.end_time} />
                    </div>
                </div>

                {form.data.start_time && form.data.end_time && (
                    <span>
                        {`Nota: El actuador estará activo durante ${getMinutes()} minutos diarios, lo que supone un costo de aproximadamente $${getPrice().toLocaleString("es-CO")}.`}
                    </span>
                )}

                <div className="flex gap-4 justify-end mt-4">
                    {automation?.id && (
                        <PrimaryButton type="button" className="bg-red-500" onClick={handleDelete}>
                            Eliminar configuración
                        </PrimaryButton>
                    )}
                    <PrimaryButton className="bg-orange-600">Guardar</PrimaryButton>
                    <button type="reset" className="hidden" ref={buttonResetRef}>reset</button>
                </div>
            </div>
        </form>
    );
}
