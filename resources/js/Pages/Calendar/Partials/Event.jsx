import {Link} from "@inertiajs/react";
import CustomLabel from "@/Components/Label.jsx";

export default function UserCase({}) {
    return (
        <Link className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded-lg bg-gray-50 px-3 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
            </svg>
            <div className="flex-1 ml-4">
                <p className="font-semibold">Visita al juzgado</p>
                <p className="text-gray-600 text-sm">01:30pm</p>
            </div>
        </Link>
    )
}
