import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";

export default function ButtonsGroup({baseUrl, sowing}) {
    return (
        <div className="mb-4 flex gap-2">
            <Link href={route('sowing_news', {sowingId: sowing.id})}>
                <PrimaryButton className="bg-rose-500">Novedades</PrimaryButton>
            </Link>
            <Link href={route('feeding', {sowingId: sowing.id})}>
                <PrimaryButton className="bg-green-600">Alimentación</PrimaryButton>
            </Link>
            <Link href={route('medicate', {sowingId: sowing.id})}>
                <PrimaryButton className="bg-blue-600">Medicamentos</PrimaryButton>
            </Link>
            <Link href={`${baseUrl}/biomasses/sowing/${sowing.id}`}>
                <PrimaryButton className="bg-indigo-600">Biomasas</PrimaryButton>
            </Link>
            <PrimaryButton className="">Mortalidad</PrimaryButton>
            <PrimaryButton className="bg-orange-600">Modificar</PrimaryButton>
            <PrimaryButton className="bg-red-600">Eliminar</PrimaryButton>
        </div>
    )
}
