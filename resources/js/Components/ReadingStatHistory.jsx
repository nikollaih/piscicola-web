import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

const transformReadings = (readings, dateKey, valueKey, filterStepStat = null) => {
    const grouped = {};

    readings.forEach((reading) => {
        const time = reading[dateKey];
        const key = reading.step_stat?.key;
        const value = parseFloat(reading[valueKey]);

        if (!key || isNaN(value)) return;
        if (filterStepStat && reading.step_stat_id !== filterStepStat.id) return;

        if (!grouped[time]) {
            grouped[time] = { date: time };
        }

        grouped[time][key] = value;
    });

    return Object.values(grouped);
};

export default function ReadingStatHistory({
                                               readings,
                                               stepStat,
                                               date = "topic_time",
                                               value = "value",
                                           }) {
    // Transforma los datos (filtra por stepStat si se pasa)
    const data = transformReadings(readings, date, value, stepStat);

    // Claves de sensores únicos (si hay varios)
    const keys = stepStat
        ? [stepStat.key]
        : [...new Set(readings.map((r) => r.step_stat?.key).filter(Boolean))];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-10 pl-0">
            <p className="text-center font-bold mb-4">{stepStat.name} - {stepStat.step.name}</p>
            <div style={{width: "100%", height: 350}}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip/>
                        {keys.length > 1 && <Legend/>}
                        {keys.map((key, index) => (
                            <Line
                                key={key}
                                type="linear"
                                dataKey={key}
                                stroke={"#8884d8"}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
