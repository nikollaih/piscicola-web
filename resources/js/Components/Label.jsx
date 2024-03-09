export default function CustomLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-xs h-fit py-1 px-1 rounded text-white bg-red-500 ` + className}>
            {value ? value : children}
        </label>
    );
}
