export default function DropDownItem({ className = '', disabled, children, ...props }) {
    return (
        <div
            {...props}
            className={
                `cursor-pointer w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-gray-100 focus:ring-offset-0 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </div>
    );
}
