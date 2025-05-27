import moment from "moment";

export default function SowingInformation({ sowing }) {
    const cards = [
        { label: "Producto", value: sowing.fish.name },
        { label: "Etapa", value: sowing.step.name },
        { label: "Estanque", value: sowing.pond.name },
        {
            label: "Cantidad de siembra",
            value: `${(sowing.quantity - sowing.dead_quantity).toLocaleString('es-CO')} / ${sowing.quantity.toLocaleString('es-CO')}`
        },
        {
            label: "Fecha de siembra",
            value: moment(sowing.manual_created_at).format('DD/MM/YYYY')
        },
        sowing.sale_date && {
            label: "Fecha de venta",
            value: `${moment(sowing.sale_date).format('DD/MM/YYYY')} (${moment(sowing.sale_date).diff(sowing.manual_created_at, 'months', true).toFixed(1)} meses)`
        }
    ].filter(Boolean); 

    return (
        <>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 min-w-[220px] text-center"
                >
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="font-semibold text-lg text-gray-800">{card.value}</p>
                </div>
            ))}
        </>
    );
}
