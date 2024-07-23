import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import '../../css/login.css';
import UQ from "../../images/uq.png";
import GQ from "../../images/gq.png";
import SR from "../../images/SR.png";

export default function Guest({ children }) {
    return (
        <div
            className="min-h-screen flex flex-col sm:justify-center items-center pt-0 md:pt-6 sm:pt-0 md:bg-gray-100 bg-white p-0 background-image-custom">
            <div className="wave right-0 sm:hidden avoid-background"></div>
            <div className="avoid-background">
                <Link href="/">
                    <ApplicationLogo width={60} className="w-30 h-30 fill-current text-gray-500"/>
                </Link>
            </div>

            <div
                className="w-full sm:max-w-md bg-white md:shadow-md overflow-hidden rounded-lg avoid-background">
                {children}
            </div>
            <footer
                className="hidden md:fixed md:block bottom-0 right-0 left-0 bg-white p-4 shadow-md avoid-background">
                <p className="mb-2 text-sm"><b>PROYECTO:</b> "FORTALECIMIENTO DE LA ACUICULTURA A TRAVÉS DE LA
                    IMPLEMENTACIÓN DE NUEVAS TECNOLOGÍAS PARA
                    EL CONTROL SISTEMATIZADO Y MAXIMIZANDO LA PRODUCTIVIDAD CON ENFOQUE DE BIOECONOMÍA Y SOSTENIBILIDAD
                    EN EL DEPARTAMENTO DEL QUINDÍO”. BPIN: <span className="text-indigo-600">2021000100495</span></p>
                <hr/>
                <div className="items-center flex justify-center align-middle mt-2 gap-6 ">
                    <img src={UQ} alt="" width={40} className="mx-6"/>
                    <img src={GQ} alt="" width={80} style={{marginTop: -15}} className="mx-6"/>
                    <img src={SR} alt="" width={120} className="mx-6"/>
                </div>
            </footer>
        </div>
    );
}
