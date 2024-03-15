import {useEffect} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import * as am5radar from '@amcharts/amcharts5/radar.js';
export default function ReadingStatHistory({readings, stepStat, date = "topic_time", value = "value"}) {
    const chartId = 'chart' + Math.floor(Math.random() * 10000000000000000);
    useEffect(() => {
        setChart()
    }, []);

    const getDataStat = () => {
        return readings.map((item) => {
            return {
                date: new Date(item[date]).getTime(),
                value: parseFloat(item[value]),
            };
        });
    }

    const setChart = () => {
        console.log(getDataStat())
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
                baseInterval: { timeUnit: "minute", count: 1 },
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
        series.data.setAll(getDataStat());
    }

    return (
        <div className="bg-white p-4 rounded-md shadow-md mb-4">
            <p className="text-center font-bold mb-4">{stepStat.name} - {stepStat.step.name}</p>
            <div id={chartId} className="w-full h-full" style={{height: 300}}/>
        </div>
    )
}
