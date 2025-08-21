import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import * as am5radar from '@amcharts/amcharts5/radar.js';
import Alarm from '@/../images/alarm.gif';
import { useEffect, useMemo } from "react";
import Constants from '@/../Constants.js';
import {formatDate} from "@/Utils.js";

export default function Speedometer({ stat }) {
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
        const ph = parseFloat(stat.value);
        switch (true) {
            case ph < 1:
                return '#ee3a37';
            case ph >= 1 && ph < 2:
                return '#f05637';
            case ph >= 2 && ph < 3:
                return '#f56f38';
            case ph >= 3 && ph < 4:
                return '#f99432';
            case ph >= 4 && ph < 5:
                return '#fac02b';
            case ph >= 5 && ph < 6:
                return '#c8cc3b';
            case ph >= 6 && ph < 7:
                return '#1baf58';
            case ph >= 7 && ph < 8:
                return '#04a85f';
            case ph >= 8 && ph < 9:
                return '#009690';
            case ph >= 9 && ph < 10:
                return '#0687c1';
            case ph >= 10 && ph < 11:
                return '#2174b7';
            case ph >= 11 && ph < 12:
                return '#3c66b1';
            case ph >= 12 && ph < 13:
                return '#4d59a7';
            case ph >= 13 && ph <= 14:
                return '#624d9c';
            case ph > 14:
                return '#7a3e96';
            default:
                return '#fff';
        }
    }, [stat]);

    const getColor = () => {
        const value = parseFloat(stat.value);
        const max = parseFloat(stat.step_stat.value_maximun);
        const min = parseFloat(stat.step_stat.value_minimun);

        if (stat.step_stat.key.toLowerCase() === 'ph') {
            return getPHColor;
        }

        return (value < min || value > max) ? Constants.COLORS.DANGER : Constants.COLORS.SUCCESS;
    }

    const getPHGradientStops = () => {
        const phColors = [
            '#ee3a37', '#f05637', '#f56f38', '#f99432', '#fac02b',
            '#c8cc3b', '#1baf58', '#04a85f', '#009690', '#0687c1',
            '#2174b7', '#3c66b1', '#4d59a7', '#624d9c', '#7a3e96'
        ];

        return phColors.map((color, index) => ({
            color: am5.color(color),
            offset: index / (phColors.length - 1)
        }));
    }

    const getStrokeGradientStops = () => {
        if (stat.step_stat.key.toLowerCase() === 'ph') {
            return getPHGradientStops();
        } else {
            const singleColor = getColor();
            return [
                { color: am5.color(singleColor), offset: 0 },
                { color: am5.color(singleColor), offset: 1 }
            ];
        }
    }

    const setChart = () => {
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
                stops: getStrokeGradientStops()
            })
        });

        let axis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                min: getMin(),
                max: getMax(),
                renderer: axisRenderer
            })
        );

        let handColor = (stat.step_stat.key.toLowerCase() === 'ph') ? getPHColor : getColor();

        let handDataItem = axis.makeDataItem({
            value: parseFloat(stat.value)
        });

        let hand = handDataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: am5radar.ClockHand.new(root, {
                radius: am5.percent(95),
                pin: {
                    color: am5.color(handColor)
                },
                bottomWidth:5,
                topWidth: 2,
                fill: am5.color(handColor),
                stroke: am5.color(handColor),
                strokeWidth: 2,
                strokeOpacity: 1
            })
        }));

        axis.createAxisRange(handDataItem);
    }

    return <div className="bg-white col-span-1 rounded-lg shadow-md mb-4 p-2 relative" >
        {stat.triggered_alarm ?
            <img src={Alarm} className="absolute left-3 top-3" style={{ width: 40, height: 40 }} /> : null
        }

        <p className="font-bold text-center">{stat.step_stat.name}</p>
        <p className="text-center text-sm mb-2">{formatDate(stat.created_at)}</p>
        <div id={stat.id} className="w-full" style={{ height: 200 }} />
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
