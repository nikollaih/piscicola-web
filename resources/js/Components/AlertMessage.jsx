import {useEffect, useState} from "react";

export default function AlertMessage({ className = '', onClose = () => {}, ...props }) {
    const [timer] = useState(5000)
    useEffect(() => {
        setTimeout(() => {
            onClose()
        }, timer)
    }, [])

    return (props.title && props.title !== '') ? (
        <div
            {...props}
            className={
                'w-full mb-4 p-3 bg-green-400 text-white border-2 border-green-500 rounded-lg' +
                className
            }
        >
            <p className="m-0">
                {props.title}
            </p>
        </div>
    ) : null;
}
