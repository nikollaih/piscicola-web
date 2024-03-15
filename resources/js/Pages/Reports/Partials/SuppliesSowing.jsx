import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function SuppliesSowing({sowing, useType}) {
    let typeTitle = ((useType === "ALIMENT") ? "alimentos" : (useType === "MEDICINE") ? "medicamentos" : "otros suministros")
    const generateReport = () => {
        location.href = route('supplies.sowing.report.exports', {sowingId: sowing.id, useType: useType});
    }

    return <div className="mt-4">
        <p>Se generará un archivo de formato excel con el suministro de {typeTitle} a la cosecha "{sowing.name}"</p>
        <PrimaryButton onClick={() => {generateReport()}} disabled={(!sowing?.id)} className="bg-orange-500 w-full mt-4 justify-center">Generar reporte</PrimaryButton>
    </div>
}
