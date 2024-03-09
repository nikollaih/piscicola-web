import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Case from "@/Pages/Cases/Partials/Case.jsx";
import Empty from "@/Components/Empty.jsx";

export default function Cases ({cases}) {

    const getCasesDom = () => {
        if(cases.length){
            return cases.map( (clientCase) => {
                return <Case />
            })
        } else {
            return <Empty title="El cliente no tiene casos" />
        }
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <header>
                <h2 className="text-lg font-medium text-gray-900">Casos del cliente</h2>
                <hr className="w-full mt-4"/>
            </header>
            <div className="items-start flex-1 py-4">
                {getCasesDom()}
            </div>
            <div className="self-end w-full text-end">
                <hr className="w-full mb-4"/>
                <PrimaryButton className="bg-indigo-600 w-fit" onClick={() => {
                }}>Nuevo caso</PrimaryButton>
            </div>
        </div>
    )
}
