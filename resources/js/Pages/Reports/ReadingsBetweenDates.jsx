import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head} from '@inertiajs/react';
import { useRef } from 'react';
import generatePDF from 'react-to-pdf';
import ReadingsBetweenDatesTemplatePDF from "@/Pages/Reports/Partials/ReadingsBetweenDatesTemplatePDF.jsx";

export default function ReadingsBetweenDates({ auth, sowing,readings,fromDate,toDate }) {
       const targetRef = useRef();
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        <button onClick={() => generatePDF(targetRef, {filename: 'page.pdf'})}>Descargar en PDF</button>
                    </h2>
                </div>
            }
        >
        <Head title="Lecturas"/>
        <div id="templatePDF"  ref={targetRef}>
            <ReadingsBetweenDatesTemplatePDF sowing={sowing} readings={readings} fromDate={fromDate} toDate={toDate} />
        </div>
        </AuthenticatedLayout>
    );
}
