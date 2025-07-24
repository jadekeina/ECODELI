import { useEffect, useState, useCallback, useContext } from "react"; // Ajout de useContext
import { Link } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext"; // Utilisation de UserContext directement
import API_URL from "@/config";
import { MapPin, ArrowRight, Euro, Calendar, Clock, Package } from "lucide-react"; // Importation d'icônes

interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    status: string;
    scheduled_at?: string; // Changé de scheduled_date pour correspondre à l'API si elle renvoie un timestamp
    total_price?: number;
    // Ajout d'autres champs si votre API les renvoie et que vous voulez les afficher
    // par exemple:
    // scheduled_date?: string; // Si l'API renvoie une date séparée
    // scheduled_time?: string; // Si l'API renvoie une heure séparée
}

// Labels pour les statuts des courses (améliorés pour l'affichage)
const statusLabels: Record<string, string> = {
    all: "Toutes les courses",
    en_attente: "En attente",
    acceptee: "Acceptée",
    refusee: "Refusée",
    en_cours: "En cours",
    terminee: "Terminée",
    annulee: "Annulée",
};

// Couleurs pour les badges de statut
const statusBadgeColors: Record<string, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    acceptee: "bg-blue-100 text-blue-800",
    refusee: "bg-red-100 text-red-800",
    en_cours: "bg-purple-100 text-purple-800",
    terminee: "bg-green-100 text-green-800",
    annulee: "bg-gray-100 text-gray-800",
    default: "bg-gray-200 text-gray-700", // Pour les statuts non définis
};

export default function ProviderCourses() {
    // Utilisation de useContext pour récupérer le user du UserContext
    const { user, loading: userContextLoading } = useContext(UserContext);
    // console.log("[ProviderCourses - Init] user:", user, "userContextLoading:", userContextLoading);

    const [rides, setRides] = useState<Ride[]>([]);
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
        // console.log("[ProviderCourses - useEffect] Début de l'effet.");

        if (userContextLoading) {
            // console.log("[ProviderCourses - useEffect] UserContext en cours de chargement, attente...");
            return;
        }
        if (!user || !user.id) {
            console.warn("[ProviderCourses - useEffect] Utilisateur non défini ou ID manquant. Arrêt du fetch.");
            setLoading(false);
            setError("Veuillez vous connecter pour voir vos courses.");
            return;
        }

        const fetchAllRides = async () => {
            const token = user.token || localStorage.getItem("token"); // Utiliser user.token en priorité
            // console.log("[ProviderCourses - fetchAllRides] Token du localStorage:", token ? "Présent" : "Absent");
            // console.log("[ProviderCourses - fetchAllRides] API_URL:", API_URL);
            // console.log("[ProviderCourses - fetchAllRides] User ID pour les requêtes attribuées:", user.id);

            setLoading(true);
            setError(null);

            try {
                // 1. Appel pour les courses ATTRBUÉES au prestataire connecté
                const assignedRidesUrl = `${API_URL}/rides/provider/${user.id}`;
                // console.log("[ProviderCourses - fetchAllRides] Requête API vers:", assignedRidesUrl);
                const assignedRes = await fetch(assignedRidesUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const assignedData = await assignedRes.json();
                // console.log("[ProviderCourses - fetchAllRides] Réponse Assigned Rides (res.ok, status):", assignedRes.ok, assignedRes.status);
                // console.log("[ProviderCourses - fetchAllRides] Données Assigned Rides JSON reçues:", assignedData);

                if (!assignedRes.ok) {
                    const errorMessage = assignedData.message || `Erreur serveur sur les courses attribuées: ${assignedRes.status}`;
                    console.error("[ProviderCourses - fetchAllRides] Erreur HTTP Assigned Rides:", errorMessage);
                    // Ne pas throw ici pour pouvoir combiner avec les pending rides même si un type échoue
                    // setError(errorMessage); // Gérer l'erreur si vous voulez l'afficher
                }
                const assignedRides = assignedData && Array.isArray(assignedData.rides) ? processAndFilterRideData(assignedData.rides) : [];
                // console.log("[ProviderCourses - fetchAllRides] Trajets attribués traités et filtrés (prix non nul):", assignedRides.length);


                // 2. Appel pour toutes les courses EN ATTENTE (non attribuées)
                const pendingRidesUrl = `${API_URL}/rides/en-attente`;
                // console.log("[ProviderCourses - fetchAllRides] Requête API vers:", pendingRidesUrl);
                const pendingRes = await fetch(pendingRidesUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const pendingData = await pendingRes.json();
                // console.log("[ProviderCourses - fetchAllRides] Réponse Pending Rides (res.ok, status):", pendingRes.ok, pendingRes.status);
                // console.log("[ProviderCourses - fetchAllRides] Données Pending Rides JSON reçues:", pendingData);

                if (!pendingRes.ok) {
                    const errorMessage = pendingData.message || `Erreur serveur sur les courses en attente: ${pendingRes.status}`;
                    console.error("[ProviderCourses - fetchAllRides] Erreur HTTP Pending Rides:", errorMessage);
                    // setError(errorMessage); // Gérer l'erreur si vous voulez l'afficher
                }
                const pendingRides = pendingData && Array.isArray(pendingData.rides) ? processAndFilterRideData(pendingData.rides) : [];
                // console.log("[ProviderCourses - fetchAllRides] Trajets en attente traités et filtrés (prix non nul):", pendingRides.length);


                // Combiner les deux listes de courses, en évitant les doublons par ID
                const combinedRidesMap = new Map<number, Ride>();
                assignedRides.forEach(ride => combinedRidesMap.set(ride.id, ride));
                pendingRides.forEach(ride => combinedRidesMap.set(ride.id, ride)); // Les pending rides peuvent écraser les assigned si même ID, ce qui est peu probable pour des statuts différents

                const allRides = Array.from(combinedRidesMap.values());
                // console.log("[ProviderCourses - fetchAllRides] Total courses combinées (après filtrage prix non nul):", allRides.length);
                setRides(allRides);

            } catch (err: any) {
                console.error("[ProviderCourses - fetchAllRides] Erreur lors du fetch combiné des trajets:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
                // console.log("[ProviderCourses - fetchAllRides] Fin du fetch combiné. loading est false.");
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

    // console.log("[ProviderCourses - Render] État actuel:", { loading, error, rides, filteredRides, filterStatus, user });


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-gray-600">Chargement des courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-red-500 font-medium">Erreur : {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8 font-inter"> {/* Fond blanc */}
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold text-[#1B4F3C] mb-8 text-center drop-shadow-sm">
                    Mes Courses de Livraison
                </h1>

                {/* Filtres de statut */}
                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    {Object.keys(statusLabels).map((statusKey) => (
                        <button
                            key={statusKey}
                            onClick={() => setFilterStatus(statusKey)}
                            className={`px-5 py-2 rounded-full text-base font-medium transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                                ${filterStatus === statusKey
                                ? "bg-[#1B4F3C] text-white transform scale-105"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {statusLabels[statusKey]}
                        </button>
                    ))}
                </div>

                {/* Messages si aucune course */}
                {rides.length === 0 && filterStatus === "all" ? (
                    <div className="bg-gray-50 p-8 rounded-2xl shadow-lg text-center border border-gray-200">
                        <p className="text-xl text-gray-600 font-medium">
                            Aucune course disponible pour le moment.
                        </p>
                    </div>
                ) : filteredRides.length === 0 && filterStatus !== "all" ? (
                    <div className="bg-gray-50 p-8 rounded-2xl shadow-lg text-center border border-gray-200">
                        <p className="text-xl text-gray-600 font-medium">
                            Aucune course "{statusLabels[filterStatus]}" trouvée.
                        </p>
                    </div>
                ) : (
                    // Liste des courses
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRides.map((ride) => (
                            <li
                                key={ride.id}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col justify-between"
                            >
                                <Link to={`/provider/courses/${ride.id}`} className="block">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-[#2C3E50] mb-1">
                                            Course #{ride.id}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                                statusBadgeColors[ride.status] || statusBadgeColors.default
                                            }`}
                                        >
                                            {statusLabels[ride.status] || ride.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-gray-700 text-sm">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            <span className="font-medium">Départ :</span> {ride.depart_address}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-emerald-600" />
                                            <span className="font-medium">Arrivée :</span> {ride.arrivee_address}
                                        </p>
                                        {ride.total_price && (
                                            <p className="flex items-center gap-2">
                                                <Euro className="w-4 h-4 text-emerald-600" />
                                                <span className="font-medium">Prix :</span>{" "}
                                                <span className="font-semibold text-lg text-[#2C3E50]">
                                                    {ride.total_price.toFixed(2)} €
                                                </span>
                                            </p>
                                        )}
                                        {ride.scheduled_at && (
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium">Prévue le :</span>{" "}
                                                {new Date(ride.scheduled_at).toLocaleDateString("fr-FR")}
                                            </p>
                                        )}
                                        {/* Vous pouvez ajouter l'heure si elle est disponible dans ride.scheduled_at ou un champ séparé */}
                                        {/* {ride.scheduled_at && (
                                            <p className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium">À :</span>{" "}
                                                {new Date(ride.scheduled_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )} */}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
