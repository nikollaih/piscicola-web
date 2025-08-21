import * as React from "react";

const TestTubeIcon = ({
       liquidColor = "#0687c1",
       size = 200,
       ...props
   }) => {
    const height = (size / 200) * 420; // mantener proporción original

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 420"
            width={size}
            height={height}
            role="img"
            aria-labelledby="title"
            style={{
                // colores por defecto + sobrescribir con prop
                "--cap": "#3d3d3d",
                "--glass": "#E6F0FF",
                "--liquid": liquidColor,
                "--ticks": "#FFFFFF",
            }}
            {...props}
        >
            <title id="title">{"Icono de tubo de ensayo con tapa"}</title>
            <defs>
                <style>
                    {`
            .cap { fill: var(--cap, #6EA1F2); }
            .glass { fill: var(--glass, #E6F0FF); }
            .liquid { fill: var(--liquid, #B89AE6); }
            .ticks { stroke: var(--ticks, #FFFFFF); stroke-width: 8; stroke-linecap: round; fill: none; stroke-opacity: 0.2 }
          `}
                </style>
            </defs>

            {/* Cuerpo de vidrio */}
            <rect className="glass" x={55} y={60} width={90} height={330} rx={45} />

            {/* Líquido */}
            <rect className="liquid" x={72} y={100} width={56} height={250} rx={28} />

            {/* Marcas */}
            <g className="ticks">
                <path d="M100 120 V 330" />
                <path d="M100 140 H 85" />
                <path d="M100 165 H 80" />
                <path d="M100 190 H 85" />
                <path d="M100 215 H 80" />
                <path d="M100 240 H 85" />
                <path d="M100 265 H 80" />
                <path d="M100 290 H 85" />
                <path d="M100 315 H 80" />
            </g>

            {/* Tapa (encima) */}
            <rect className="cap" x={30} y={20} width={140} height={70} rx={22} />
        </svg>
    );
};

export default TestTubeIcon;
