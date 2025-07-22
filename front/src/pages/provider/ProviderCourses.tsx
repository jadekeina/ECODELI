import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";

interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    status: string;
    scheduled_date?: string;
    total_price?: number; // Après traitement, nous nous attendons à un nombre ou undefined
}

// Labels pour les statuts des courses
const statusLabels: Record<string, string> = {
    all: "Toutes",
    en_attente: "En attente", // Courses en attente d'acceptation par un prestataire
    acceptee: "Acceptée",
    refusee: "Refusée",
    en_cours: "En cours", // Courses attribuées et en cours
    terminee: "Terminée",
    annulee: "Annulée",
};

export default function ProviderCourses() {
    const { user, loading: userContextLoading } = useUserContext();
    console.log("[ProviderCourses - Init] user:", user, "userContextLoading:", userContextLoading);

    const [rides, setRides] = useState<Ride[]>([]); // Contiendra toutes les courses (attribuées et en attente)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Fonction pour traiter les données de trajet (conversion de total_price et FILTRAGE)
    const processAndFilterRideData = useCallback((rideData: any[]): Ride[] => {
        return rideData
            .map((ride: any) => {
                const processedPrice = typeof ride.total_price === 'string'
                    ? parseFloat(ride.total_price)
                    : ride.total_price;
                return {
                    ...ride,
                    total_price: processedPrice
                };
            })
            // FILTRAGE ICI : Garde seulement les rides où total_price est un nombre valide (non null/undefined/NaN)
            .filter(ride => typeof ride.total_price === 'number' && !isNaN(ride.total_price));
    }, []);

    useEffect(() => {
        console.log("[ProviderCourses - useEffect] Début de l'effet.");

        if (userContextLoading) {
            console.log("[ProviderCourses - useEffect] UserContext en cours de chargement, attente...");
            return;
        }
        if (!user || !user.id) {
            console.warn("[ProviderCourses - useEffect] Utilisateur non défini ou ID manquant. Arrêt du fetch.");
            setLoading(false);
            return;
        }

        const fetchAllRides = async () => {
            const token = localStorage.getItem("token");
            console.log("[ProviderCourses - fetchAllRides] Token du localStorage:", token ? "Présent" : "Absent");
            console.log("[ProviderCourses - fetchAllRides] API_URL:", API_URL);
            console.log("[ProviderCourses - fetchAllRides] User ID pour les requêtes attribuées:", user.id);

            setLoading(true);
            setError(null);

            try {
                // 1. Appel pour les courses ATTRBUÉES au prestataire connecté
                const assignedRidesUrl = `${API_URL}/rides/provider/${user.id}`;
                console.log("[ProviderCourses - fetchAllRides] Requête API vers:", assignedRidesUrl);
                const assignedRes = await fetch(assignedRidesUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const assignedData = await assignedRes.json();
                console.log("[ProviderCourses - fetchAllRides] Réponse Assigned Rides (res.ok, status):", assignedRes.ok, assignedRes.status);
                console.log("[ProviderCourses - fetchAllRides] Données Assigned Rides JSON reçues:", assignedData);

                if (!assignedRes.ok) {
                    const errorMessage = assignedData.message || `Erreur serveur sur les courses attribuées: ${assignedRes.status}`;
                    console.error("[ProviderCourses - fetchAllRides] Erreur HTTP Assigned Rides:", errorMessage);
                    throw new Error(errorMessage);
                }
                // Traiter et filtrer les trajets attribués
                const assignedRides = assignedData && Array.isArray(assignedData.rides) ? processAndFilterRideData(assignedData.rides) : [];
                console.log("[ProviderCourses - fetchAllRides] Trajets attribués traités et filtrés (prix non nul):", assignedRides.length);


                // 2. Appel pour toutes les courses EN ATTENTE (non attribuées)
                const pendingRidesUrl = `${API_URL}/rides/en-attente`;
                console.log("[ProviderCourses - fetchAllRides] Requête API vers:", pendingRidesUrl);
                const pendingRes = await fetch(pendingRidesUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const pendingData = await pendingRes.json();
                console.log("[ProviderCourses - fetchAllRides] Réponse Pending Rides (res.ok, status):", pendingRes.ok, pendingRes.status);
                console.log("[ProviderCourses - fetchAllRides] Données Pending Rides JSON reçues:", pendingData);

                if (!pendingRes.ok) {
                    const errorMessage = pendingData.message || `Erreur serveur sur les courses en attente: ${pendingRes.status}`;
                    console.error("[ProviderCourses - fetchAllRides] Erreur HTTP Pending Rides:", errorMessage);
                    throw new Error(errorMessage);
                }
                // Traiter et filtrer les trajets en attente
                const pendingRides = pendingData && Array.isArray(pendingData.rides) ? processAndFilterRideData(pendingData.rides) : [];
                console.log("[ProviderCourses - fetchAllRides] Trajets en attente traités et filtrés (prix non nul):", pendingRides.length);


                // Combiner les deux listes de courses
                const combinedRidesMap = new Map<number, Ride>();
                assignedRides.forEach(ride => combinedRidesMap.set(ride.id, ride));
                pendingRides.forEach(ride => combinedRidesMap.set(ride.id, ride));

                const allRides = Array.from(combinedRidesMap.values());
                console.log("[ProviderCourses - fetchAllRides] Total courses combinées (après filtrage prix non nul):", allRides.length);
                setRides(allRides);

            } catch (err: any) {
                console.error("[ProviderCourses - fetchAllRides] Erreur lors du fetch combiné des trajets:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
                console.log("[ProviderCourses - fetchAllRides] Fin du fetch combiné. loading est false.");
            }
        };

        fetchAllRides();
    }, [user, userContextLoading, processAndFilterRideData]); // Dépendances de l'effet

    // Filtrer les courses basées sur le statut sélectionné
    const filteredRides = rides.filter(ride => {
        if (filterStatus === "all") {
            return true;
        }
        return ride.status === filterStatus;
    });

    console.log("[ProviderCourses - Render] État actuel:", { loading, error, rides, filteredRides, filterStatus, user });


    if (loading) return <p className="p-6">Chargement des courses...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;
    // Messages adaptés pour les deux types de courses
    if (rides.length === 0 && filterStatus === "all") return <p className="p-6">Aucune course disponible pour le moment (ou toutes ont un prix non défini).</p>;
    if (filteredRides.length === 0 && filterStatus !== "all") return <p className="p-6">Aucune course "{statusLabels[filterStatus]}" trouvée avec un prix défini.</p>;


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-[#1B4F3C]">Mes courses</h1>

            <div className="mb-4 flex flex-wrap gap-2">
                {Object.keys(statusLabels).map((statusKey) => (
                    <button
                        key={statusKey}
                        onClick={() => setFilterStatus(statusKey)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                            ${filterStatus === statusKey
                            ? "bg-[#1B4F3C] text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {statusLabels[statusKey]}
                    </button>
                ))}
            </div>

            <ul className="space-y-3">
                {filteredRides.map((ride) => (
                    <li key={ride.id} className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer">
                        <Link to={`/provider/courses/${ride.id}`} className="block">
                            <div className="flex justify-between">
                                <span>
                                    {ride.depart_address} → {ride.arrivee_address}
                                </span>
                                <span className="capitalize font-semibold text-green-700">{statusLabels[ride.status] || ride.status.replace('_', ' ')}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {/* Ici, nous savons que total_price est un nombre valide grâce au filtre amont */}
                                {`${ride.total_price?.toFixed(2)} €`}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
