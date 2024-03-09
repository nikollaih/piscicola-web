import {useEffect, useState} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
export default function LinearChart({readings, date, value, chartId}) {
    const [loaded, setLoaded] = useState(false);
    const [series, setSeries] = useState(false);

    useEffect(() => {
        if(!loaded) {
            setChart();
            setLoaded(true);
        }
        else {
            setData();
        }
    }, [readings]);

    const getDataStat = () => {
        if(readings.length > 0)
            return readings.map((item) => {
                return {
                    date: new Date(item[date]).getTime(),
                    value: item[value],
                };
            });

        return [];
    }

    const setChart = () => {
        // Create root and chart
        let root = am5.Root.new(chartId);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: true,
                wheelY: "zoomX",
                layout: root.verticalLayout
            })
        );

        // Craete Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: "day", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    inverted: false
                }),
            })
        );

        // Create series
        let series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: 'Test',
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: 'value',
                valueXField: "date",
                seriesTooltipTarget: 'bullet',
                locationX: 0,
            })
        );
        series.strokes.template.setAll({
            strokeWidth: 2
        });

        series.bullets.push(function () {
            let circle = am5.Circle.new(root, {
                radius: 4,
                templateField: 'bulletSettings',
                fill: series.get('fill'),
                strokeWidth: 3,
                stroke: root.interfaceColors.get('background'),
                tooltipText: "[bold]{valueY}[/]\n{valueX.formatDate(\"YYYY/MM/dd hh:mm a\")}",
            });

            return am5.Bullet.new(root, {
                sprite: circle,
                locationX: 0
            });
        });

        series.set('fill', am5.color(0x8d375a));
        series.set('stroke', am5.color(0x8d375a));
        setSeries(series);
        series.data.setAll(getDataStat());
    }

    const setData = () => {
        if(series){
            series.data.setAll(getDataStat());
        }
    }

    return (
        <div id={chartId} className="w-full h-full" />
    )
}
