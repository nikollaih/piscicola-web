import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { Link } from "@inertiajs/react";
import ActionsButton from "@/Pages/Sowings/Partials/ActionsButton.jsx";

export default function ButtonsGroup({ onDelete = () => {}, sowing }) {
    return (
        <div className=" mb-4 w-full flex flex-col gap-2">
            <ActionsButton sowing={sowing} />
            {/* <div className="gap-2 flex self-end">
                <Link href={route('sowing.edit', {sowingId: sowing.id})}>
                    <PrimaryButton className="bg-orange-600">Modificar</PrimaryButton>
                </Link>
                <PrimaryButton onClick={() => {
                    onDelete(sowing.id)
                }} className="bg-red-600">Eliminar</PrimaryButton>
            </div> */}
        </div>
    );
}
