import {Link} from "@inertiajs/react";
import Constants from "../../../../Constants.js";
import moment from "moment";
export default function SowingNewsItem ({feed}) {
    return (
        <div
              className="bg-white overflow-hidden shadow-sm rounded-lg p-5 w-full">
            <p className="font-bold text-lg">{feed.title}</p>
            <p className="text-gray-500 text-xs mb-4">{moment(feed.created_at).format(Constants.DATETIMEFORMAT)}</p>

            <div dangerouslySetInnerHTML={{__html: feed.description}}/>
        </div>
    )
}
