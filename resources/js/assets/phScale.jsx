import * as React from "react";
const SVGComponent = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="auto"
        viewBox="0 0 1200 200"
        role="img"
        aria-labelledby="title"
        {...props}
    >
        <title id="title">{"Escala de pH (0\u201314)"}</title>
        <defs>
            <linearGradient id="phGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0000" />
                <stop offset="21.4%" stopColor="#ff7f00" />
                <stop offset="42.8%" stopColor="#ffff00" />
                <stop offset="50%" stopColor="#14c38e" />
                <stop offset="71.4%" stopColor="#2979ff" />
                <stop offset="100%" stopColor="#8e24aa" />
            </linearGradient>
            <style>
                {
                    "\n      .label { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }\n    "
                }
            </style>
        </defs>
        <text
            className="label"
            x={40}
            y={25}
            textAnchor="start"
            fontSize={35}
            fill="#111"
            opacity={0.8}
        >
            {"\xC1cido"}
        </text>
        <text
            className="label"
            x={600}
            y={25}
            textAnchor="middle"
            fontSize={35}
            fill="#111"
            opacity={0.8}
        >
            {"Neutro (7)"}
        </text>
        <text
            className="label"
            x={1160}
            y={25}
            textAnchor="end"
            fontSize={35}
            fill="#111"
            opacity={0.8}
        >
            {"Alcalino"}
        </text>
        <rect
            x={40}
            y={40}
            width={1120}
            height={60}
            rx={30}
            fill="url(#phGradient)"
        />
        <rect
            x={42}
            y={42}
            width={1116}
            height={30}
            rx={30}
            fill="#ffffff"
            opacity={0.08}
        />
        <g stroke="#111" strokeWidth={2} opacity={0.6} fill="none">
            <line x1={40} y1={102} x2={40} y2={118} />
            <line x1={120} y1={102} x2={120} y2={118} />
            <line x1={200} y1={102} x2={200} y2={118} />
            <line x1={280} y1={102} x2={280} y2={118} />
            <line x1={360} y1={102} x2={360} y2={118} />
            <line x1={440} y1={102} x2={440} y2={118} />
            <line x1={520} y1={102} x2={520} y2={118} />
            <line x1={600} y1={102} x2={600} y2={118} />
            <line x1={680} y1={102} x2={680} y2={118} />
            <line x1={760} y1={102} x2={760} y2={118} />
            <line x1={840} y1={102} x2={840} y2={118} />
            <line x1={920} y1={102} x2={920} y2={118} />
            <line x1={1000} y1={102} x2={1000} y2={118} />
            <line x1={1080} y1={102} x2={1080} y2={118} />
            <line x1={1160} y1={102} x2={1160} y2={118} />
        </g>
        <g className="label" fontSize={18} fill="#111" opacity={0.85}>
            <text x={40} y={150} textAnchor="middle">
                {"0"}
            </text>
            <text x={120} y={150} textAnchor="middle">
                {"1"}
            </text>
            <text x={200} y={150} textAnchor="middle">
                {"2"}
            </text>
            <text x={280} y={150} textAnchor="middle">
                {"3"}
            </text>
            <text x={360} y={150} textAnchor="middle">
                {"4"}
            </text>
            <text x={440} y={150} textAnchor="middle">
                {"5"}
            </text>
            <text x={520} y={150} textAnchor="middle">
                {"6"}
            </text>
            <text x={600} y={150} textAnchor="middle">
                {"7"}
            </text>
            <text x={680} y={150} textAnchor="middle">
                {"8"}
            </text>
            <text x={760} y={150} textAnchor="middle">
                {"9"}
            </text>
            <text x={840} y={150} textAnchor="middle">
                {"10"}
            </text>
            <text x={920} y={150} textAnchor="middle">
                {"11"}
            </text>
            <text x={1000} y={150} textAnchor="middle">
                {"12"}
            </text>
            <text x={1080} y={150} textAnchor="middle">
                {"13"}
            </text>
            <text x={1160} y={150} textAnchor="middle">
                {"14"}
            </text>
        </g>
    </svg>
);
export default SVGComponent;
