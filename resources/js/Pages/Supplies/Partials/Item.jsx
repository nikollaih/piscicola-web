import Constants from "@/../Constants.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";
export default function SupplyItem({supply}) {
    const getUse = () => {
        return Constants.SUPPLIES_USES_TYPES[supply.use_type];
    }

    const getUseColor = () => {
        switch (supply.use_type){
            case "ALIMENT":
                return "text-green-600";
                break;
            case "MEDICINE":
                return "text-blue-600";
                break;
        }

        return "text-orange-600";
    }

    return (
        <Link href={route('supply.view', {supplyId: supply.id})}>
            <div className="bg-white p-4 shadow-md rounded-md hover:bg-gray-50 cursor-pointer">
                <p className="text-lg">{supply.name}</p>
                <p className="text-gray-500 text-sm">Disponible: <span
                    className="font-bold text-black">{supply.available_quantity}{supply.measurement_unit.name}</span>
                </p>
                <p className={getUseColor() + ' font-bold'}>{getUse()}</p>
            </div>
        </Link>

    )
}
