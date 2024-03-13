import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";

export default function ButtonsGroup({onDelete = () => {}, sowing}) {
    return (
        <div className="mb-4 flex gap-2">
            <div className="flex gap-2 flex-1">
                <Link href={route('sowing_news', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-rose-500">Actividad</PrimaryButton>
                </Link>
                <Link href={route('feeding', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-green-600">Alimentación</PrimaryButton>
                </Link>
                <Link href={route('medicate', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-blue-600">Medicamentos</PrimaryButton>
                </Link>
                <Link href={route('biomasses', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-indigo-600">Biomasas</PrimaryButton>
                </Link>
                <Link href={route('mortalities', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-gray-800">Mortalidad</PrimaryButton>
                </Link>
                <Link href={route('expenses', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-amber-500">Gastos</PrimaryButton>
                </Link>
                <Link href={route('sowing.resume', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-emerald-600">R. Financiero</PrimaryButton>
                </Link>
            </div>

            <div className="gap-2 flex self-end">
                <Link href={route('sowing.edit', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-orange-600">Modificar</PrimaryButton>
                </Link>
                <PrimaryButton onClick={() => {onDelete(sowing.id)}} className="bg-red-600">Eliminar</PrimaryButton>
            </div>

        </div>
    )
}
