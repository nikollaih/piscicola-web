export const DashboardActuatorStatus = ({actuator}) => {
    return <div className={'bg-white p-4 rounded-lg flex justify-between items-center'}>
        <div>
            <p>{actuator.name}</p>
            <p className={'text-gray-500 text-sm'}>{actuator?.pond?.name}</p>
        </div>
        <div className={'flex flex-col justify-center items-center'}>
            <div className={`h-[20px] w-[20px] rounded-full   ${(actuator?.is_turned_on === 1) ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
    </div>
}
