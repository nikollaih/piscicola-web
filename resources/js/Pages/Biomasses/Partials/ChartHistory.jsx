import {useEffect} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import * as am5radar from '@amcharts/amcharts5/radar.js';
export default function BiomassesChartHistory({biomasses}) {
    useEffect(() => {
        setChart()
    }, []);

    const getDataStat = () => {
        return biomasses.map((item) => {
            return {
                date: new Date(item.manual_created_at).getTime(),
                value: item.approximate_weight,
            };
        });
    }

    const setChart = () => {
        // Create root and chart
        let root = am5.Root.new("chart");

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
                tooltipText: "[bold]{valueY}gr[/]\n{valueX.formatDate(\"YYYY/MM/dd hh:mm a\")}",
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
        <div id="chart" className="w-full h-full min-h-[300px]" />
    )
}
