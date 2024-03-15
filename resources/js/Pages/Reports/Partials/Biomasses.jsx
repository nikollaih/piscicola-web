import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function BiomassesReport({sowing}) {
    const generateReport = () => {
        location.href = route('biomasses.report.exports', {sowingId: sowing.id});
    }

    return <div className="mt-4">

        <p>Se generará un archivo de formato excel con el registro de biomasas pertenecientes a la cosecha "{sowing.name}"</p>
        <PrimaryButton onClick={() => {generateReport()}} disabled={(!sowing?.id)} className="bg-orange-500 w-full mt-4 justify-center">Generar reporte</PrimaryButton>
    </div>
}
