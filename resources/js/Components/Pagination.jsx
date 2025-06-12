import { Link } from '@inertiajs/react';

export default function Pagination({ links, search }) {
    const getLabel = (label) => {
        switch (label){
            case "&laquo; Previous":
                return "Anterior";
                break;
            case "Next &raquo;":
                return "Siguiente";
                break;
            default:
                return label;
                break;
        }
    }

    const getLink = (url) => {
        return (search) ? url + "&search=" + search : url;
    }

    function getClassName(active) {
        if(active) {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary bg-indigo-500 text-white hover:text-dark";
        } else{
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary";
        }
    }

    return (
        links.length > 3 && (
            <div className="mb-4">
                <div className="flex flex-wrap mt-8">
                    {links.map((link, key) => (
                        link.url === null ?
                            (<div
                                key={key}
                                className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                            >{getLabel(link.label)}</div>) :

                            (<Link
                                key={key}
                                className={getClassName(link.active)}
                                href={ getLink(link.url) }
                            >{getLabel(link.label)}</Link>)
                    ))}
                </div>
            </div>
        )
    );
}
