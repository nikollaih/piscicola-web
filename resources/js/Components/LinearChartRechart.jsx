import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function LinearChart({ readings, date, value, chartId }) {
    // Transforma los datos
    const data = readings.map((item) => ({
        date: new Date(item[date]).toLocaleString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }),
        value: parseFloat(item[value]),
    }));

    return (
        <div id={chartId} className="w-full" style={{ height: 400 }} >
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        angle={-40} // más inclinación
                        textAnchor="end"
                        height={130} // más espacio vertical
                        interval="preserveStartEnd"
                    />
                    <YAxis domain={['dataMin - 3', 'dataMax + 3']} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={1}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
