import React from 'react';
import { XCircle, CheckCircle, AlertTriangle } from 'lucide-react'; // Icônes pour le modal

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'confirm' | 'alert' | 'success' | 'error';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onConfirm,
                                                                 title,
                                                                 message,
                                                                 confirmText = 'Confirmer',
                                                                 cancelText = 'Annuler',
                                                                 type = 'confirm',
                                                             }) => {
    if (!isOpen) return null;

    let icon;
    let titleColorClass = 'text-gray-800';
    let buttonColorClass = 'bg-blue-600 hover:bg-blue-700';

    switch (type) {
        case 'confirm':
            icon = <AlertTriangle className="w-10 h-10 text-yellow-500" />;
            titleColorClass = 'text-yellow-700';
            buttonColorClass = 'bg-blue-600 hover:bg-blue-700';
            break;
        case 'alert':
            icon = <AlertTriangle className="w-10 h-10 text-orange-500" />;
            titleColorClass = 'text-orange-700';
            buttonColorClass = 'bg-blue-600 hover:bg-blue-700'; // Peut être changé si c'est juste une alerte sans confirmation
            break;
        case 'success':
            icon = <CheckCircle className="w-10 h-10 text-green-500" />;
            titleColorClass = 'text-green-700';
            buttonColorClass = 'bg-green-600 hover:bg-green-700';
            break;
        case 'error':
            icon = <XCircle className="w-10 h-10 text-red-500" />;
            titleColorClass = 'text-red-700';
            buttonColorClass = 'bg-red-600 hover:bg-red-700';
            break;
        default:
            icon = <AlertTriangle className="w-10 h-10 text-gray-500" />;
            break;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-95 animate-fade-in-up">
                <div className="flex flex-col items-center mb-6">
                    {icon}
                    <h3 className={`text-2xl font-bold mt-4 text-center ${titleColorClass}`}>
                        {title}
                    </h3>
                </div>
                <p className="text-gray-700 text-center mb-8 text-lg">{message}</p>
                <div className="flex justify-center gap-4">
                    {type === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition duration-200 shadow-sm"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-3 ${buttonColorClass} text-white rounded-xl font-semibold transition duration-200 shadow-md`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

