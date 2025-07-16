// 📁 src/pages/provider/CourseDetail.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";

interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    scheduled_date: string;
    distance_km: number;
    duree: string;
    total_price: number;
    note: string;
    client_firstname: string;
    client_lastname: string;
    client_email: string;
    status: string;
}

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ride, setRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, hasProAccount } = useUserContext();

    useEffect(() => {
        const fetchRide = async (): Promise<void> => {
            try {
                const res = await fetch(`${API_URL}/rides/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Erreur serveur");
                setRide(data.ride);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Erreur inconnue");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRide();
    }, [id]);

    const handleAccept = async (): Promise<void> => {
        if (!user?.id) {
            alert("Utilisateur non identifié.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/rides/${id}/assign`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ provider_id: user.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur serveur");
            navigate("/provider/courses");
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert("Erreur : " + err.message);
            } else {
                alert("Erreur inconnue");
            }
        }
    };

    const handleRefuse = () => {
        navigate("/provider/courses");
    };

    if (loading) return <p className="p-6">Chargement...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!ride) return <p className="p-6 text-gray-500">Course introuvable.</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[#1B4F3C] mb-6">Détail de la course</h1>
            <div className="bg-white rounded shadow p-6 space-y-4">
                <p><strong>Départ :</strong> {ride.depart_address}</p>
                <p><strong>Arrivée :</strong> {ride.arrivee_address}</p>
                <p><strong>Date prévue :</strong> {new Date(ride.scheduled_date).toLocaleString()}</p>
                <p><strong>Distance :</strong> {ride.distance_km} km</p>
                <p><strong>Durée estimée :</strong> {ride.duree || "Non précisée"}</p>
                <p><strong>Prix :</strong> {ride.total_price ? Number(ride.total_price).toFixed(2) + " €" : "Non défini"}</p>
                <p><strong>Client :</strong> {ride.client_firstname} {ride.client_lastname}</p>
                <p><strong>Email :</strong> {ride.client_email}</p>
                <p><strong>Note client :</strong> {ride.note || "Aucune"}</p>

                {user?.role === "provider" && user?.statut === "valide" && hasProAccount && ride.status === "en_attente" && (
                    <div className="flex gap-4 mt-6">
                        <button onClick={handleAccept} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Accepter
                        </button>
                        <button onClick={handleRefuse} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                            Refuser
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
