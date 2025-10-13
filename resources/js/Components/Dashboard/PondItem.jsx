import Estanque from '@/../images/estanque.png'
import moment from "moment";
import Constants from "../../../Constants.js";

export const DashboardPondStatus = ({pond}) => {

    const getStatColor = (value, minimum, maximum) => {
        return (value > maximum || value < minimum) ? 'text-red-500' : 'text-green-500';
    }

    const getReadingsDOM = () => {
        return pond.active_sowing.latest_stats.map((r) =>
            <div key={r.id} className={'flex justify-between items-center mt-1'}>
                <div>
                    <p className={'-mb-2'}>{r.step_stat.name}</p>
                    <span className="text-xs text-gray-500">{moment(r.topic_time).format(Constants.DATETIMEFORMAT)}</span>
                </div>
                <div className={`flex flex-col justify-center items-center ${getStatColor(parseFloat(r.value), parseFloat(r.step_stat.value_minimun), parseFloat(r.step_stat.value_maximun))}`}>
                    {parseFloat(r.value).toFixed(1)}
                </div>
            </div>
        )
    }

    return <div className={'bg-white px-4 pb-4 rounded-lg '}>
        <img src={Estanque} alt="" className={'max-w-40 mx-auto'}/>
        <div className={'flex justify-between items-center'}>
            <div>
                <p className={'font-semibold -mb-2'}>{pond.name}</p>
                <span className={'text-gray-500 text-xs'}>Estado del sensor</span>
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div
                    className={`h-[20px] w-[20px] rounded-full   ${(pond?.latest_status?.status === 1) ? 'bg-green-500' : 'bg-red-500'}`}/>
            </div>
        </div>
        <hr className={'my-1'} />
        {
            pond.active_sowing &&
            Array.isArray(pond.active_sowing.latest_stats) &&
                getReadingsDOM()
        }
    </div>
}
