import React from 'react';


export const BaseModal = ({ onClose, children, title, className }) => {
    return (
        <div
            id="default-modal"
            className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex overflow-y-auto overflow-x-hidden fixed inset-0 z-[9999] justify-center items-center w-full h-full"
        >
            <div className={`relative p-4 w-full max-w-5xl max-h-full ${className}`}>
                <div className="relative bg-white rounded-2xl shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-6 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-white">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

