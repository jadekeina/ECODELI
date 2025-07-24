import React from "react";

interface RideTrackingProviderProps {
    currentStatus: string;
}

const statusSteps = [
    { key: "en_attente", label: "En attente" },
    { key: "en_cours", label: "En cours" },
    { key: "terminee", label: "Terminée" },
];

const statusColors: Record<string, string> = {
    completed: "bg-green-600",
    current: "bg-emerald-400",
    upcoming: "bg-gray-300",
};

const RideTrackingProvider: React.FC<RideTrackingProviderProps> = ({ currentStatus }) => {
    const currentIndex = statusSteps.findIndex((step) => step.key === currentStatus);

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-6 text-[#1B4F3C]">Suivi de la course</h2>
            <div className="relative flex items-center justify-between">
                {/* Barre de progression */}
                <div className="absolute top-4 left-4 right-4 h-2 rounded bg-gray-300">
                    <div
                        className="h-2 rounded bg-emerald-500 transition-all duration-500"
                        style={{
                            width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
                        }}
                    />
                </div>

                {/* Cercles des étapes */}
                {statusSteps.map((step, index) => {
                    let circleColor = statusColors.upcoming;
                    if (index < currentIndex) circleColor = statusColors.completed;
                    else if (index === currentIndex) circleColor = statusColors.current;

                    return (
                        <div key={step.key} className="relative flex flex-col items-center z-10 w-20">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${circleColor}`}
                            >
                                {index < currentIndex ? "✔" : index + 1}
                            </div>
                            <span className="mt-2 text-xs font-medium text-center capitalize">{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RideTrackingProvider;
