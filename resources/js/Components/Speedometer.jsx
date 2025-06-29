import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import * as am5radar from '@amcharts/amcharts5/radar.js';
import Alarm from '@/../images/alarm.gif';
import {useEffect, useMemo} from "react";
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

    const getPHColor = useMemo(() => {
        const ph = stat.value;
        switch (true) {
            case ph < 1:
                return '#ee3a37'; // Color para pH entre 0 y 1
            case ph >= 1 && ph < 2:
                return '#f05637'; // Color para pH entre 1 y 2
            case ph >= 2 && ph < 3:
                return '#f56f38'; // Color para pH entre 2 y 3
            case ph >= 3 && ph < 4:
                return '#f99432'; // Color para pH entre 3 y 4
            case ph >= 4 && ph < 5:
                return '#fac02b'; // Color para pH entre 4 y 5
            case ph >= 5 && ph < 6:
                return '#c8cc3b'; // Color para pH entre 5 y 6
            case ph >= 6 && ph < 7:
                return '#1baf58'; // Color para pH entre 6 y 7
            case ph >= 7 && ph < 8:
                return '#04a85f'; // Color para pH entre 7 y 8
            case ph >= 8 && ph < 9:
                return '#009690'; // Color para pH entre 8 y 9
            case ph >= 9 && ph < 10:
                return '#0687c1'; // Color para pH entre 9 y 10
            case ph >= 10 && ph < 11:
                return '#2174b7'; // Color para pH entre 10 y 11
            case ph >= 11 && ph < 12:
                return '#3c66b1'; // Color para pH entre 11 y 12
            case ph >= 12 && ph < 13:
                return '#4d59a7'; // Color para pH entre 12 y 13
            case ph >= 13 && ph <= 14:
                return '#624d9c'; // Color para pH entre 13 y 14
            case ph > 14:
                return '#7a3e96'; // Color para pH mayor 14
            default:
                return '#fff'; // Color por defecto para valores fuera del rango
        }
    }, [stat])

    const getColor = () => {

        let value = parseFloat(stat.value);
        let maximum = parseFloat(stat.step_stat.value_maximun);
        let minimum = parseFloat(stat.step_stat.value_minimun);

        if(stat.step_stat.key.toLowerCase() === 'ph'){
            return getPHColor
        }

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

    return <div className="bg-white col-span-1 rounded-lg shadow-md mb-4 p-2 relative" >
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
                <h2 className="font-bold text-xl">{parseFloat(stat.value).toFixed(1)}</h2>
            </div>
            <div className="text-center flex-1">
                <p className="text-gray-700">Max</p>
                <p className="font-bold">{parseFloat(stat.step_stat.value_maximun)}</p>
            </div>
        </div>
    </div>
}
