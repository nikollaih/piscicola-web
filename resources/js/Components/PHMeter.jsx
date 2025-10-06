import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import * as am5radar from '@amcharts/amcharts5/radar.js';
import Alarm from '@/../images/alarm.gif';
import { useEffect, useMemo } from "react";
import Constants from '@/../Constants.js';
import {formatDate} from "@/Utils.js";
import TestTubeIcon from "@/assets/phIcon.jsx";
import PhScale from "@/assets/phScale.jsx";

export default function PHMeter({ stat }) {
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

    return <div className="bg-white col-span-1 rounded-lg shadow-md mb-4 p-2 relative">
        {stat.triggered_alarm ?
            <img src={Alarm} className="absolute left-3 top-3" style={{width: 40, height: 40}}/> : null
        }

        <p className="font-bold text-center">{stat.step_stat.name}</p>
        <p className="text-center text-sm mb-2">{formatDate(stat.topic_time)}</p>
        <div className="flex flex-col justify-center items-center">
            <TestTubeIcon size={100} liquidColor={getPHColor}/>
            <h2 className="font-bold text-xl mb-2">{parseFloat(stat.value).toFixed(1)}</h2>
            <PhScale />
        </div>
    </div>
}
