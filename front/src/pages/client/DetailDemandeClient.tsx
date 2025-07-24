import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import axios from "axios";
// Ajout de FileText pour l'icône de téléchargement
import { Loader2, Package, Calendar, Clock, MapPin, MessageCircle, User, AlertCircle, ArrowLeft, Info, XCircle, CheckCircle, FileText } from "lucide-react";

interface Demande {
    id: number;
    prestation_description: string;
    date: string;
    heure: string;
    lieu: string;
    commentaire?: string;
    statut: "en_attente" | "acceptee" | "refusee" | "en_cours" | "terminee" | "annulee" | "ignoree";
    prestataire?: {
        nom: string;
    };
}

const DetailDemandeClient = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext) as { user: { id: number | string; role: string; token: string } | null };
    const [demande, setDemande] = useState<Demande | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelMessage, setCancelMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDemande = async () => {
            setLoading(true);
            setError(null);

            if (!user || user.role !== "client" || !user.token) {
                console.warn("⚠️ [DetailDemandeClient] Utilisateur non connecté, non client ou token manquant. Redirection vers /login.");
                navigate("/login");
                setLoading(false);
                return;
            }

            const cleanedDemandeId = parseInt(String(id), 10);
            if (isNaN(cleanedDemandeId)) {
                console.error("❌ [DetailDemandeClient] ID de demande invalide dans l'URL:", id);
                setError("ID de demande invalide. Impossible de charger les détails.");
                setLoading(false);
                return;
            }

            console.log("🔍 [DetailDemandeClient] Tentative de récupération des détails de la demande ID nettoyé :", cleanedDemandeId);

            try {
                const res = await axios.get(`${API_URL}/service_requests/${cleanedDemandeId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                console.log("✅ [DetailDemandeClient] Réponse API brute pour le détail de la demande :", res.data);

                if (res.data && res.data.request) {
                    setDemande(res.data.request);
                    console.log("✅ [DetailDemandeClient] Données de demande traitées (imbriquées) :", res.data.request);
                } else if (res.data) {
                    setDemande(res.data);
                    console.log("✅ [DetailDemandeClient] Données de demande traitées (directes) :", res.data);
                } else {
                    console.warn("❗[DetailDemandeClient] Format de réponse inattendu ou données manquantes :", res.data);
                    setError("Format de données inattendu ou demande introuvable.");
                    setDemande(null);
                }
            } catch (err: any) {
                console.error("❌ [DetailDemandeClient] Erreur lors du fetch de la demande :", err);
                setError(err.response?.data?.message || "Erreur lors du chargement des détails de la demande.");
                setDemande(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDemande();
    }, [id, user, navigate]);

    const handleCancelRequest = async () => {
        if (!demande || !user || !user.token) return;

        setShowCancelConfirm(false);
        setIsCancelling(true);
        setCancelMessage(null);

        try {
            const res = await axios.patch(`${API_URL}/service_requests/${demande.id}/status`,
                { statut: "annulee" },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (res.status === 200) {
                setCancelMessage("Demande annulée avec succès !");
                setDemande((prevDemande) => prevDemande ? { ...prevDemande, statut: "annulee" } : null);
                setTimeout(() => navigate('/client/demandes'), 1500);
            } else {
                setCancelMessage(res.data?.message || "Erreur lors de l'annulation de la demande.");
            }
        } catch (err: any) {
            console.error("❌ Erreur lors de l'annulation de la demande :", err);
            setCancelMessage(err.response?.data?.message || "Erreur serveur lors de l'annulation.");
        } finally {
            setIsCancelling(false);
        }
    };

    const getBadge = (statut: string) => {
        const base = "px-3 py-1 rounded-full text-sm font-medium uppercase";
        if (statut === "en_attente") return <span className={`${base} bg-yellow-100 text-yellow-800`}>En attente</span>;
        if (statut === "acceptee") return <span className={`${base} bg-green-100 text-green-800`}>Acceptée</span>;
        if (statut === "refusee") return <span className={`${base} bg-red-100 text-red-800`}>Refusée</span>;
        if (statut === "en_cours") return <span className={`${base} bg-blue-100 text-blue-800`}>En cours</span>;
        if (statut === "terminee") return <span className={`${base} bg-purple-100 text-purple-800`}>Terminée</span>;
        if (statut === "annulee") return <span className={`${base} bg-gray-100 text-gray-800`}>Annulée</span>;
        if (statut === "ignoree") return <span className={`${base} bg-gray-200 text-gray-700`}>Ignorée</span>;
        console.warn("❗[DetailDemandeClient] Statut inconnu ou non géré :", statut);
        return <span className={`${base} bg-gray-300 text-gray-700`}>Statut : {statut}</span>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter">
                <Loader2 className="animate-spin w-10 h-10 text-[#2C3E50]" />
                <p className="ml-3 text-lg text-gray-600">Chargement des détails de la demande...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter">
                <p className="text-lg text-red-500 font-medium p-4 bg-red-100 rounded-lg border border-red-200">{error}</p>
            </div>
        );
    }

    if (!demande) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter">
                <p className="text-lg text-gray-600">Demande introuvable.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-[#2C3E50] flex items-center gap-3">
                        <Package className="w-8 h-8 text-[#2C3E50]" /> Détail de la demande
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition duration-200 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </button>
                </div>

                {cancelMessage && (
                    <div className={`p-4 rounded-lg mb-6 text-center shadow-md flex items-center gap-2 justify-center
                        ${cancelMessage.includes("succès") ? "bg-green-100 border border-green-200 text-green-700" : "bg-red-100 border border-red-200 text-red-700"}`}>
                        {cancelMessage.includes("succès") ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-medium text-lg">{cancelMessage}</p>
                    </div>
                )}

                <div className="space-y-4 text-gray-700 text-lg">
                    <p className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Package className="w-6 h-6 text-emerald-600" />
                        <strong className="font-semibold text-[#142D2D]">Prestation :</strong> {demande.prestation_description}
                    </p>
                    <p className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Calendar className="w-6 h-6 text-gray-500" />
                        <strong className="font-semibold text-[#142D2D]">Date :</strong> {demande.date}
                    </p>
                    <p className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Clock className="w-6 h-6 text-gray-500" />
                        <strong className="font-semibold text-[#142D2D]">Heure :</strong> {demande.heure}
                    </p>
                    <p className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <MapPin className="w-6 h-6 text-emerald-600 mt-0.5" />
                        <strong className="font-semibold text-[#142D2D]">Lieu :</strong> {demande.lieu}
                    </p>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <p className="flex items-center gap-3 mb-1.5">
                            <MessageCircle className="w-6 h-6 text-gray-500" />
                            <strong className="font-semibold text-[#142D2D]">Commentaire :</strong>
                        </p>
                        <p className="ml-9 text-gray-800 leading-normal text-sm">
                            {demande.commentaire || "Aucun commentaire."}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Info className="w-6 h-6 text-gray-500" />
                        <strong className="font-semibold text-[#142D2D]">Statut :</strong> {getBadge(demande.statut)}
                    </div>
                    {demande.prestataire && (
                        <p className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <User className="w-6 h-6 text-gray-500" />
                            <strong className="font-semibold text-[#142D2D]">Prestataire :</strong> {demande.prestataire.nom}
                        </p>
                    )}
                </div>

                {/* Bouton Annuler la demande */}
                {demande.statut === "en_attente" && (
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            disabled={isCancelling}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-105
                                ${isCancelling ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                        >
                            {isCancelling ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <XCircle className="w-5 h-5" />
                            )}
                            {isCancelling ? "Annulation..." : "Annuler la demande"}
                        </button>
                    </div>
                )}

                {/* Bouton Télécharger la facture (ajouté ici) */}
                {demande.statut === "terminee" && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => window.open(`${API_URL}/invoices/download?type=service_request&id=${demande.id}`, '_blank')}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-md hover:bg-emerald-700 transition"
                        >
                            <FileText className="w-5 h-5" /> Télécharger la facture
                        </button>
                    </div>
                )}

                {/* Modale de confirmation d'annulation */}
                {showCancelConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center border border-gray-200">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirmer l'annulation ?</h2>
                            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                                >
                                    Non, garder
                                </button>
                                <button
                                    onClick={handleCancelRequest}
                                    className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                                >
                                    Oui, annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailDemandeClient;
