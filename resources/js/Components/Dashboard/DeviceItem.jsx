import {useMemo} from "react";
import moment from "moment";

export const DashboardDeviceStatus = ({device}) => {

    const daysToNextMaintenance = moment(device?.latest_maintenance?.next_maintenance_at).diff(moment(), 'days');

    const getClassColor = useMemo(() => {
        if(!device?.latest_maintenance){
            return 'bg-gray-500'
        }

        if(daysToNextMaintenance > 5){
            return 'bg-green-500';
        }
        else if(daysToNextMaintenance > 0){
            return 'bg-orange-500';
        }
        else {
            return "bg-red-500";
        }
    }, [device])

    return <div className={'bg-white p-4 rounded-lg flex justify-between items-center'}>
        <div>
            <p>{device.name}</p>
            <p className={'text-gray-500 text-sm'}>{device?.pond?.name ?? 'Sin estanque'}</p>
            <p className={'text-gray-500 text-sm'}>{device?.latest_maintenance ? `${daysToNextMaintenance} días para mantenimiento` : 'Sin mantenimiento'}</p>
        </div>
        <div className={'flex flex-col justify-center items-center'}>
        <div className={`h-[20px] w-[20px] rounded-full   ${getClassColor}`} />
        </div>
    </div>
}
