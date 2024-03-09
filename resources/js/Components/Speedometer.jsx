import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import * as am5radar from '@amcharts/amcharts5/radar.js';
import Alarm from '@/../images/alarm.gif';
import {useEffect} from "react";
import Constants from '@/../Constants.js';

export default function Speedometer ({stat}) {
    useEffect(() => {
        setChart()
    }, [])

    const getMax = () => {
        let value = parseFloat(stat.value);
        let maximum = parseFloat(stat.step_stat.value_maximun);

        return (value > maximum) ? value : maximum;
    }

    const getMin = () => {
        let value = parseFloat(stat.value);
        let minimum = parseFloat(stat.step_stat.value_minimun);

        return (value < minimum) ? value : minimum;
    }

    const getColor = () => {
        let value = parseFloat(stat.value);
        let maximum = parseFloat(stat.step_stat.value_maximun);
        let minimum = parseFloat(stat.step_stat.value_minimun);

        return (value < minimum || value > maximum) ? Constants.COLORS.DANGER : Constants.COLORS.SUCCESS;
    }

    const setChart = () => {
        // Create root and chart
        let root = am5.Root.new(stat.id);
        let chart = root.container.children.push(
            am5radar.RadarChart.new(root, {
                startAngle: -180,
                endAngle: 0,
                radius: am5.percent(95),
                innerRadius: -20
            })
        );

        let axisRenderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -10,
            strokeOpacity: 1,
            strokeWidth: 15,
            strokeGradient: am5.LinearGradient.new(root, {
                rotation: 0,
                stops: [
                    { color: am5.color(getColor()) },
                    { color: am5.color(getColor()) }
                ]
            })
        });

        let axis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                min: getMin(),
                max: getMax(),
                renderer: axisRenderer
            })
        );

        let handDataItem = axis.makeDataItem({
            value: parseFloat(stat.value)
        });

        let hand = handDataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: am5radar.ClockHand.new(root, {
                radius: am5.percent(95),
            })
        }));

        axis.createAxisRange(handDataItem);
    }

    return <div className="bg-white col-span-1 sm:rounded-lg shadow-md mb-4 p-2 relative" >
        {
            (stat.triggered_alarm) ?
                <img src={Alarm} className="absolute left-3 top-3" style={{width: 40, height: 40}}/>
                : null
        }

        <p className="font-bold text-center mb-2">{stat.step_stat.name}</p>
        <div id={stat.id} className="w-full"  style={{height: 200}}/>
        <div className="flex justify-between mt-4">
            <div className="text-center flex-1">
                <p className="text-gray-700">Min</p>
                <p className="font-bold">{parseFloat(stat.step_stat.value_minimun)}</p>
            </div>
            <div className="text-center flex-1">
                <h2 className="font-bold text-xl">{parseFloat(stat.value)}</h2>
            </div>
            <div className="text-center flex-1">
                <p className="text-gray-700">Max</p>
                <p className="font-bold">{parseFloat(stat.step_stat.value_maximun)}</p>
            </div>
        </div>
    </div>
}
