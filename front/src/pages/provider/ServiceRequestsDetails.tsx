import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import axios from "axios";
import {
    Loader2,
    Package,
    Calendar,
    Clock,
    MapPin,
    MessageCircle,
    User,
    ArrowLeft,
    CheckCircle, // Importation de CheckCircle
    XCircle // Importation de XCircle
} from "lucide-react";

// Interface pour les détails d'une demande de prestation
interface RequestDetail {
    id: number;
    date: string;
    heure: string;
    lieu: string;
    commentaire: string;
    statut?: string; // Rend 'statut' optionnel pour gérer les cas où il est absent de l'API
    type: string;
    firstname: string;
    lastname: string;
}

// Mappage des statuts aux couleurs Tailwind CSS pour les badges
const statusColorMap: { [key: string]: string } = {
    en_attente: "bg-yellow-100 text-yellow-800",
    acceptee: "bg-green-100 text-green-800",
    refusee: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-700",
};

const ServiceRequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false); // État pour gérer le chargement des boutons de statut

    useEffect(() => {
        const fetchRequestDetails = async () => {
            setLoading(true);
            setError(null);
            setRequest(null);

            try {
                if (!user?.token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }

                if (!id) {
                    setError("ID de demande manquant dans l'URL.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get<{ message: string; request: RequestDetail }>(`${API_URL}/service_requests/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (response.status === 200 && response.data && response.data.request) {
                    setRequest(response.data.request);
                } else {
                    throw new Error(response.data?.message || "Erreur lors de la récupération des détails de la demande.");
                }

            } catch (err: any) {
                console.error("❌ Erreur lors du chargement des détails de la demande :", err);
                setError(err.response?.data?.message || "Erreur serveur lors du chargement de la demande.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.token && id) {
            fetchRequestDetails();
        } else if (!user?.token) {
            setLoading(false);
            setError("Veuillez vous connecter pour voir les détails de la demande.");
        } else if (!id) {
            setLoading(false);
            setError("ID de demande non fourni.");
        }
    }, [id, user]);

    // Fonction pour gérer la mise à jour du statut
    const handleStatusUpdate = async (newStatus: "acceptee" | "refusee") => {
        if (!request) return; // Ne rien faire si la demande n'est pas chargée
        setUpdatingStatus(true); // Active l'état de chargement pour les boutons
        setError(null); // Réinitialise les erreurs

        try {
            const token = user?.token;
            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                return;
            }

            const payload = { statut: newStatus }; // Le backend attend 'statut'

            const res = await axios.patch(`${API_URL}/service_requests/${request.id}/status`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                // Met à jour l'état local de la demande pour refléter le nouveau statut
                setRequest(prevRequest => prevRequest ? { ...prevRequest, statut: newStatus } : null);
                console.log(`✅ Statut de la demande ${request.id} mis à jour à '${newStatus}'.`);
            } else {
                setError(res.data.message || "Erreur lors de la mise à jour du statut.");
            }
        } catch (err: any) {
            console.error("❌ Erreur lors de la mise à jour du statut :", err);
            setError(err.response?.data?.message || "Erreur serveur lors de la mise à jour du statut.");
        } finally {
            setUpdatingStatus(false); // Désactive l'état de chargement
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                    </button>
                    <h1 className="text-3xl font-extrabold text-[#2C3E50] text-center drop-shadow-sm flex-grow">
                        Détails de la Demande
                    </h1>
                    <div className="w-16"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <Loader2 className="animate-spin w-12 h-12 text-[#2C3E50]" />
                        <p className="ml-4 text-xl text-gray-600">Chargement des détails de la demande...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
                        <p className="font-medium text-lg">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                        </button>
                    </div>
                ) : !request ? (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">Aucune demande trouvée pour cet ID.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                        </button>
                    </div>
                ) : (
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                            <p className="text-lg text-gray-800 flex items-center gap-3">
                                <User className="w-6 h-6 text-[#3498DB]" />
                                <span className="font-semibold">Client :</span> {request.firstname} {request.lastname}
                            </p>
                            <p className="text-lg text-gray-800 flex items-center gap-3">
                                <Package className="w-6 h-6 text-[#3498DB]" />
                                <span className="font-semibold">Prestation :</span> {request.type}
                            </p>
                            <p className="text-lg text-gray-800 flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-[#3498DB]" />
                                <span className="font-semibold">Date :</span> {new Date(request.date).toLocaleDateString("fr-FR")}
                            </p>
                            <p className="text-lg text-gray-800 flex items-center gap-3">
                                <Clock className="w-6 h-6 text-[#3498DB]" />
                                <span className="font-semibold">Heure :</span> {request.heure}
                            </p>
                            <p className="text-lg text-gray-800 flex items-center gap-3 col-span-1 md:col-span-2">
                                <MapPin className="w-6 h-6 text-[#3498DB]" />
                                <span className="font-semibold">Lieu :</span> {request.lieu}
                            </p>
                            {request.commentaire && (
                                <p className="text-lg text-gray-800 flex items-start gap-3 col-span-1 md:col-span-2">
                                    <MessageCircle className="w-6 h-6 text-[#3498DB] flex-shrink-0 mt-1" />
                                    <span className="font-semibold">Commentaire :</span> {request.commentaire}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                            <span className={`inline-block px-5 py-2 rounded-full text-lg font-bold uppercase shadow-sm ${
                                statusColorMap[request.statut || 'default']
                            }`}>
                                Statut actuel : {request.statut ? request.statut.replace("_", " ") : 'Non spécifié'}
                            </span>

                            {/* Boutons Accepter/Refuser, affichés uniquement si le statut est "en_attente" */}
                            {request.statut === "en_attente" && (
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleStatusUpdate("acceptee")}
                                        disabled={updatingStatus}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md transition-colors duration-200
                                            ${updatingStatus
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-green-600 text-white hover:bg-green-700"
                                        }`}
                                    >
                                        {updatingStatus ? (
                                            <Loader2 className="animate-spin w-6 h-6" />
                                        ) : (
                                            <CheckCircle className="w-6 h-6" />
                                        )}
                                        Accepter
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate("refusee")}
                                        disabled={updatingStatus}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md transition-colors duration-200
                                            ${updatingStatus
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                        }`}
                                    >
                                        {updatingStatus ? (
                                            <Loader2 className="animate-spin w-6 h-6" />
                                        ) : (
                                            <XCircle className="w-6 h-6" />
                                        )}
                                        Refuser
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceRequestDetails;
