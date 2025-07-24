import { useEffect, useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import axios from "axios";
import { Loader2, Package, Calendar, Clock, MapPin, MessageCircle, User, CheckCircle, XCircle, FileText } from "lucide-react"; // Ajout de FileText
import { useNavigate } from "react-router-dom"; // Ajout de useNavigate

// Interface pour les éléments de demande de prestation
interface RequestItem {
    id: number;
    date: string;
    heure: string;
    lieu: string;
    commentaire: string;
    statut: string;
    type: string;
    firstname: string;
    lastname: string;
}

// Mappage des statuts aux couleurs Tailwind CSS pour les badges
const statusColorMap: { [key: string]: string } = {
    en_attente: "bg-yellow-100 text-yellow-800",
    acceptee: "bg-green-100 text-green-800",
    refusee: "bg-red-100 text-red-800",
    // Ajoutez d'autres statuts si nécessaire
    default: "bg-gray-100 text-gray-700",
};

const GererStatutsPrestations = () => {
    const { user } = useUserContext();
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingRequestId, setUpdatingRequestId] = useState<number | null>(null); // Pour désactiver les boutons pendant la mise à jour

    const navigate = useNavigate(); // Initialisation de useNavigate

    useEffect(() => {
        const fetchProviderRequests = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!user?.token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }

                // 1. Récupérer les infos du provider lié à l'utilisateur connecté
                const res = await axios.get(`${API_URL}/provider/me`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (res.status !== 200 || !res.data.provider?.id) {
                    throw new Error(res.data.message || "Erreur lors de la récupération du profil prestataire.");
                }

                const providerId = res.data.provider.id;
                console.log("✅ Profil prestataire récupéré. ID:", providerId);

                // 2. Une fois le provider_id récupéré, fetch les demandes
                const response = await axios.get<RequestItem[]>(`${API_URL}/service_requests/provider/${providerId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (response.status !== 200) {
                    throw new Error(response.data.message || "Erreur lors de la récupération des demandes de prestations.");
                }

                setRequests(response.data.requests || []); // Assurez-vous que 'requests' est bien un tableau
                console.log("✅ Demandes de prestations récupérées:", response.data.requests);

            } catch (err: any) {
                console.error("❌ Erreur lors de la récupération des demandes :", err);
                setError(err.response?.data?.message || "Une erreur inattendue est survenue lors du chargement des demandes.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchProviderRequests();
        } else {
            setLoading(false);
            setError("Veuillez vous connecter pour gérer vos demandes.");
        }
    }, [user]);

    // Fonction pour gérer la mise à jour du statut
    const handleStatusUpdate = async (requestId: number, newStatus: "acceptee" | "refusee") => {
        setUpdatingRequestId(requestId); // Désactive les boutons pour cette demande
        setError(null); // Réinitialise les erreurs

        try {
            const token = user?.token; // Utiliser user?.token au lieu de localStorage.getItem("token") pour la cohérence
            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                return;
            }

            const payload = { statut: newStatus }; // Le backend attend 'statut'

            const res = await axios.patch(`${API_URL}/service_requests/${requestId}/status`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                // Met à jour l'état local des demandes pour refléter le nouveau statut
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.id === requestId ? { ...req, statut: newStatus } : req
                    )
                );
                console.log(`✅ Demande ${requestId} mise à jour au statut '${newStatus}'.`);
            } else {
                setError(res.data.message || "Erreur lors de la mise à jour du statut.");
            }
        } catch (err: any) {
            console.error("❌ Erreur lors de la mise à jour du statut :", err);
            setError(err.response?.data?.message || "Erreur serveur lors de la mise à jour du statut.");
        } finally {
            setUpdatingRequestId(null); // Réactive les boutons
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-3xl font-extrabold text-[#2C3E50] mb-8 text-center drop-shadow-sm">
                    Gérer les Demandes de Prestations
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin w-10 h-10 text-[#2C3E50]" />
                        <p className="ml-3 text-lg text-gray-600">Chargement des demandes...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">Aucune demande de prestation à gérer pour l'instant.</p>
                        <p className="mt-2 text-gray-600">Vos clients n'ont pas encore fait de requêtes.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((req) => (
                            <div key={req.id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-transform duration-200 hover:scale-[1.01]">
                                <p className="text-lg text-gray-800 mb-2 flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#3498DB]" />
                                    <span className="font-semibold">Client :</span> {req.firstname} {req.lastname}
                                </p>
                                <p className="text-md text-gray-700 mb-1 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-[#3498DB]" />
                                    <span className="font-medium">Prestation :</span> {req.type}
                                </p>
                                <p className="text-md text-gray-700 mb-1 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#3498DB]" />
                                    <span className="font-medium">Date :</span> {req.date} à {req.heure}
                                </p>
                                <p className="text-md text-gray-700 mb-1 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#3498DB]" />
                                    <span className="font-medium">Lieu :</span> {req.lieu}
                                </p>
                                {req.commentaire && (
                                    <p className="text-md text-gray-700 mb-1 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-[#3498DB]" />
                                        <span className="font-medium">Commentaire :</span> {req.commentaire}
                                    </p>
                                )}
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase shadow-sm ${
                                        statusColorMap[req.statut] || statusColorMap.default
                                    }`}>
                                        Statut : {req.statut.replace("_", " ")}
                                    </span>

                                    <div className="flex space-x-3"> {/* Conteneur pour les boutons */}
                                        {/* Nouveau bouton "Voir les détails" */}
                                        <button
                                            onClick={() => navigate(`/provider/service-requests/${req.id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg shadow-md hover:bg-[#2980B9] transition duration-200"
                                        >
                                            <FileText className="w-5 h-5" />
                                            Voir les détails
                                        </button>

                                        {req.statut === "en_attente" && (
                                            <> {/* Fragment pour grouper les boutons Accepter/Refuser */}
                                                <button
                                                    onClick={() => handleStatusUpdate(req.id, "acceptee")}
                                                    disabled={updatingRequestId === req.id}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200
                                                        ${updatingRequestId === req.id
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"
                                                    }`}
                                                >
                                                    {updatingRequestId === req.id ? (
                                                        <Loader2 className="animate-spin w-5 h-5" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5" />
                                                    )}
                                                    Accepter
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(req.id, "refusee")}
                                                    disabled={updatingRequestId === req.id}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200
                                                        ${updatingRequestId === req.id
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-red-600 text-white hover:bg-red-700"
                                                    }`}
                                                >
                                                    {updatingRequestId === req.id ? (
                                                        <Loader2 className="animate-spin w-5 h-5" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5" />
                                                    )}
                                                    Refuser
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GererStatutsPrestations;
