import Estanque from '@/../images/estanque.png'

export const DashboardPondStatus = ({pond}) => {
    return <div className={'bg-white px-4 pb-4 rounded-lg '}>
        <img src={Estanque} alt="" className={'max-w-40 mx-auto'}/>
        <div className={'flex justify-between items-center'}>
            <p>{pond.name}</p>
            <div className={'flex flex-col justify-center items-center'}>
                <div
                    className={`h-[20px] w-[20px] rounded-full   ${(pond?.latest_status?.status === 1) ? 'bg-green-500' : 'bg-red-500'}`}/>
            </div>
        </div>
    </div>
}
