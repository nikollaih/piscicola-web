export const DashboardPondStatus = ({pond}) => {
    return <div className={'bg-white p-4 rounded-lg flex justify-between items-center'}>
        <p>{pond.name}</p>
        <div className={'flex flex-col justify-center items-center'}>
            <div className={`h-[20px] w-[20px] rounded-full   ${(pond?.latest_status?.status === 1) ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
    </div>
}
