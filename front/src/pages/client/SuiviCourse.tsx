import { JSX, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RideTrackingClient from "@/components/client/RideTrackingClient";
import API_URL from "@/config";
import { useUserContext } from "@/contexts/UserContext";

interface Ride {
    id: number;
    status: string;
    scheduled_date?: string;
    depart_address: string;
    arrivee_address: string;
    total_price: number;
    delivery_driver_name?: string;
    delivery_driver_phone?: string;
}

const SuiviCourse = (): JSX.Element => {
    const { rideId } = useParams<{ rideId: string }>();
    const { user, loading: userLoading } = useUserContext();
    const [ride, setRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Etat pour formulaire signalement
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportMessage, setReportMessage] = useState("");
    const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRide = async () => {
            if (userLoading) return;

            if (!user || !user.token) {
                setError("Vous n'êtes pas connecté.");
                setLoading(false);
                return;
            }

            try {
                if (!rideId) throw new Error("Identifiant de course manquant");

                const res = await fetch(`${API_URL}/rides/get/${rideId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Erreur serveur lors de la récupération de la course");
                }
                setRide(data.ride);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Erreur inconnue lors de la récupération de la course.");
            } finally {
                setLoading(false);
            }
        };

        fetchRide();
    }, [rideId, user, userLoading]);

    const handleReportSubmit = async () => {
        if (!reportMessage.trim() || !user?.token || !ride?.id) return;

        setReportStatus("sending");

        try {
            const response = await fetch(`${API_URL}/support/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    rideId: ride.id,
                    message: reportMessage,
                }),
            });

            if (!response.ok) throw new Error("Erreur serveur");

            setReportStatus("sent");
            setReportMessage("");
            setShowReportForm(false);
        } catch (error) {
            console.error("Erreur lors de l'envoi du rapport :", error);
            setReportStatus("error");
        }
    };

    if (loading || userLoading) return <p className="p-6">Chargement...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;
    if (!ride) return <p className="p-6 text-gray-500">Course introuvable.</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-6 space-y-6 relative">
                <RideTrackingClient
                    currentStatus={ride.status}
                    rideDetails={ride}
                    rideId={ride.id}
                />



                {/* Bouton Retour */}
                <button
                    onClick={() => navigate("/dashboard-client")}
                    className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                    ← Retour au tableau de bord
                </button>

                {/* Bouton Signaler un problème */}
                <button
                    onClick={() => setShowReportForm((v) => !v)}
                    className="mb-4 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                    Signaler un problème
                </button>

                {/* Formulaire de signalement */}
                {showReportForm && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-300 shadow-lg max-w-md mx-auto">
                        <textarea
                            rows={3}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Décrivez le problème rencontré..."
                            value={reportMessage}
                            onChange={(e) => setReportMessage(e.target.value)}
                        />

                        <div className="flex justify-between items-center">
                            {reportStatus === "error" && (
                                <p className="text-red-600 text-sm">Erreur lors de l'envoi, réessayez.</p>
                            )}
                            {reportStatus === "sent" && (
                                <p className="text-green-600 text-sm">Signalement envoyé, merci !</p>
                            )}

                            <button
                                onClick={handleReportSubmit}
                                disabled={reportStatus === "sending"}
                                className={`px-4 py-2 rounded ${
                                    reportStatus === "sending" ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                                } text-white`}
                            >
                                {reportStatus === "sending" ? "Envoi..." : "Envoyer"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuiviCourse;
