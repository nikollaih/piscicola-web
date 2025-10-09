import Bomba from "../../../images/bomba_agua.png";
import Blower from "../../../images/blower.png";
import {useMemo} from "react";

export const DashboardActuatorStatus = ({actuator}) => {
    const getSource = useMemo(() => {
        if(actuator?.actuator_type?.name === 'Motobomba') {
            return <img src={Bomba} alt="" className={'max-w-32 mx-auto mix-blend-multiply'}/>
        }

        return <img src={Blower} alt="" className={'max-w-24 mx-auto mix-blend-multiply py-4'}/>
    }, [actuator])

    return <div className={'bg-white px-4 pb-4 rounded-lg '}>
        {getSource}
        <div className={'rounded-lg flex justify-between items-center'}>
            <div>
                <p>{actuator.name}</p>
                <p className={'text-gray-500 text-sm'}>{actuator?.pond?.name}</p>
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div
                    className={`h-[20px] w-[20px] rounded-full   ${(actuator?.is_turned_on === 1) ? 'bg-green-500' : 'bg-red-500'}`}/>
            </div>
        </div>
    </div>
}
