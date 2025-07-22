import React from "react";

interface RideDetails {
    id: number;
    status: string;
    scheduled_date?: string;
    depart_address: string;
    arrivee_address: string;
    total_price: number | string | null | undefined;
    delivery_driver_name?: string;
    delivery_driver_phone?: string;
}

interface RideTrackingClientProps {
    currentStatus: string;
    rideId: number;
    estimatedArrival?: string;
    rideDetails: RideDetails;
}

const statusSteps = ["en_attente", "en_cours", "en_route", "terminee"];

const RideTrackingClient: React.FC<RideTrackingClientProps> = ({
                                                                   currentStatus,
                                                                   rideId,
                                                                   estimatedArrival,
                                                                   rideDetails
                                                               }) => {
    const currentIndex = statusSteps.indexOf(currentStatus);

    const formatPrice = (price: number | string | null | undefined) => {
        if (typeof price === "number") return `${price.toFixed(2)} €`;
        if (typeof price === "string") {
            const parsed = parseFloat(price);
            if (!isNaN(parsed)) return `${parsed.toFixed(2)} €`;
        }
        return "Prix non défini";
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Suivi de la course #{rideDetails.id || rideId}</h2>
                {estimatedArrival && (
                    <span className="text-sm text-gray-500">
                        Arrivée estimée : {new Date(estimatedArrival).toLocaleString()}
                    </span>
                )}
            </div>

            <div className="text-gray-700 space-y-1">
                <p>Départ : <strong>{rideDetails.depart_address}</strong></p>
                <p>Arrivée : <strong>{rideDetails.arrivee_address}</strong></p>
                <p>Date prévue : {rideDetails.scheduled_date ? new Date(rideDetails.scheduled_date).toLocaleString() : "Non définie"}</p>
                <p>Prix : <strong>{formatPrice(rideDetails.total_price)}</strong></p>
                {rideDetails.delivery_driver_name && (
                    <p>Livreur : {rideDetails.delivery_driver_name} {rideDetails.delivery_driver_phone && `(${rideDetails.delivery_driver_phone})`}</p>
                )}
            </div>

            {/* Barre de progression */}
            <div className="relative w-full h-3 bg-gray-300 rounded-full mt-6 mb-4">
                {/* Barre verte animée */}
                <div
                    className="h-3 bg-emerald-500 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentIndex + 1) / statusSteps.length) * 100}%` }}
                />
            </div>

            {/* Étapes avec cercles */}
            <div className="flex justify-between">
                {statusSteps.map((step, index) => {
                    const isActive = index === currentIndex;
                    const isCompleted = index < currentIndex;
                    return (
                        <div key={step} className="flex flex-col items-center text-center w-20">
                            <div
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                                ${
                                    isCompleted
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : isActive
                                            ? "border-emerald-500 text-emerald-500 font-bold"
                                            : "border-gray-300 text-gray-400"
                                }`}
                            >
                                {isCompleted ? "✔" : index + 1}
                            </div>
                            <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                {step.replace("_", " ")}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RideTrackingClient;
