import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import '../../css/login.css';

export default function Guest({ children }) {
    return (
        <div
            className="min-h-screen flex flex-col sm:justify-center items-center pt-0 md:pt-6 sm:pt-0 md:bg-gray-100 bg-white p-0">
            <div className="wave right-0 sm:hidden"></div>
            <div>
                <Link href="/">
                    <ApplicationLogo width={60} className="w-30 h-30 fill-current text-gray-500"/>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white md:shadow-md overflow-hidden rounded-lg">
                {children}
            </div>
        </div>
    );
}
