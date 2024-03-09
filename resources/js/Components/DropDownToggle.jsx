export default function DropDownToggle({ className = '', disabled, children, ...props }) {
    return (
        <div
            {...props}
            className={
                `items-center flex w-full border-gray-300 focus:border-indigo-500 rounded-md shadow-sm border h-10 text-start px-4 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            <div className="flex-1">
                {children}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" className="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
            </svg>
        </div>
    );
}
