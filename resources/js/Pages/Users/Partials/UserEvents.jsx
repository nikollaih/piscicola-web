import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Event from "@/Pages/Calendar/Partials/Event.jsx";
import Empty from "@/Components/Empty.jsx";

export default function UserEvents ({events}) {

    const getCasesDom = () => {
        if(events.length){
            return events.map( (userCase) => {
                return <Event />
            })
        } else {
            return <Empty title="El usuario no tiene eventos para hoy" />
        }
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <header>
                <h2 className="text-lg font-medium text-gray-900">Eventos del dia</h2>
                <hr className="w-full mt-4"/>
            </header>
            <div className="items-start flex-1 py-4">
                {getCasesDom()}
            </div>
        </div>
    )
}
