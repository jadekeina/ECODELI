import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import axios from "axios";
import { Loader2, Package, Calendar, MapPin, MessageCircle, AlertCircle, Info, Filter, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";

interface Demande {
    id: number;
    prestation_description: string; // CORRECTION ICI : Nouvelle propriété
    date: string;
    heure: string;
    lieu: string;
    commentaire?: string;
    statut: "en_attente" | "acceptee" | "refusee" | "en_cours" | "terminee" | "annulee" | "ignoree";
}

const DemandesClient = () => {
    const { user } = useContext(UserContext) as { user: { id: number | string; role: string; token: string } | null };
    const [allDemandes, setAllDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDemandes = async () => {
            setLoading(true);
            setError(null);

            if (!user || user.role !== "client" || !user.token) {
                console.warn("⚠️ [DemandesClient] Utilisateur non connecté, non client ou token manquant. Redirection vers /login.");
                navigate("/login");
                setLoading(false);
                return;
            }

            const userIdAsString = String(user.id);
            const cleanedUserId = parseInt(userIdAsString, 10);
            if (isNaN(cleanedUserId)) {
                console.error("❌ [DemandesClient] user.id n'est pas un nombre valide après parsing:", user.id);
                setError("ID utilisateur invalide. Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            console.log("🔍 [DemandesClient] Tentative de récupération des demandes pour l'utilisateur ID nettoyé :", cleanedUserId);

            try {
                const res = await axios.get(`${API_URL}/service_requests/client/${cleanedUserId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                console.log("✅ [DemandesClient] Réponse API :", res.data);

                if (Array.isArray(res.data)) {
                    setAllDemandes(res.data);
                } else if (res.data && Array.isArray(res.data.requests)) {
                    setAllDemandes(res.data.requests);
                } else {
                    console.warn("❗[DemandesClient] Format inattendu de la réponse :", res.data);
                    setAllDemandes([]);
                    setError("Format de données inattendu reçu du serveur.");
                }
            } catch (err: any) {
                console.error("❌ [DemandesClient] Erreur lors du fetch des demandes :", err);
                setError(err.response?.data?.message || "Erreur lors du chargement de vos demandes.");
                setAllDemandes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, [user, navigate]);

    const filteredAndSortedDemandes = useMemo(() => {
        let currentDemandes = [...allDemandes];

        if (filterStatus !== "all") {
            currentDemandes = currentDemandes.filter(demande => demande.statut === filterStatus);
        }

        currentDemandes.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.heure}`);
            const dateB = new Date(`${b.date}T${b.heure}`);
            if (sortOrder === "desc") {
                return dateB.getTime() - dateA.getTime();
            } else {
                return dateA.getTime() - dateB.getTime();
            }
        });

        return currentDemandes;
    }, [allDemandes, filterStatus, sortOrder]);


    const getBadge = (statut: string) => {
        const base = "px-3 py-1 rounded-full text-xs font-medium uppercase";
        if (statut === "en_attente") return <span className={`${base} bg-yellow-100 text-yellow-800`}>En attente</span>;
        if (statut === "acceptee") return <span className={`${base} bg-green-100 text-green-800`}>Acceptée</span>;
        if (statut === "refusee") return <span className={`${base} bg-red-100 text-red-800`}>Refusée</span>;
        if (statut === "en_cours") return <span className={`${base} bg-blue-100 text-blue-800`}>En cours</span>;
        if (statut === "terminee") return <span className={`${base} bg-purple-100 text-purple-800`}>Terminée</span>;
        if (statut === "annulee") return <span className={`${base} bg-gray-100 text-gray-800`}>Annulée</span>;
        if (statut === "ignoree") return <span className={`${base} bg-gray-200 text-gray-700`}>Ignorée</span>;
        return <span className={`${base} bg-gray-300 text-gray-700`}>Statut : {statut}</span>;
    };

    const filterButtons = [
        { label: "Toutes", value: "all" },
        { label: "En attente", value: "en_attente" },
        { label: "Acceptées", value: "acceptee" },
        { label: "Refusées", value: "refusee" },
        { label: "Annulées", value: "annulee" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 text-center drop-shadow-sm">
                    📋 Mes Demandes de Prestations
                </h1>

                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-gray-700 font-semibold flex items-center gap-1">
                            <Filter className="w-5 h-5 text-gray-600" /> Filtrer par :
                        </span>
                        {filterButtons.map((button) => (
                            <button
                                key={button.value}
                                onClick={() => setFilterStatus(button.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                                    ${filterStatus === button.value
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300 transition duration-200 font-medium text-sm"
                    >
                        {sortOrder === "desc" ? (
                            <ArrowDownWideNarrow className="w-4 h-4" />
                        ) : (
                            <ArrowUpWideNarrow className="w-4 h-4" />
                        )}
                        Date {sortOrder === "desc" ? "la plus récente" : "la plus ancienne"}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin w-10 h-10 text-[#2C3E50]" />
                        <p className="ml-3 text-lg text-gray-600">Chargement de vos demandes...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                ) : filteredAndSortedDemandes.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">Aucune demande trouvée pour les filtres actuels.</p>
                        <p className="mt-2 text-gray-600">Essayez de modifier vos filtres ou d'ajouter une nouvelle demande.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredAndSortedDemandes.map((d) => (
                            <div
                                key={d.id}
                                className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-transform duration-200 hover:scale-[1.01] flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="font-bold text-xl text-[#155250] mb-1 flex items-center gap-2">
                                        <Package className="w-6 h-6 text-emerald-600" /> {d.prestation_description} {/* CORRECTION ICI */}
                                    </h2>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-500" /> {d.date} à {d.heure}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-gray-500" /> {d.lieu}
                                    </p>
                                    {d.commentaire && (
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5 text-gray-500" /> {d.commentaire}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        {getBadge(d.statut)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/client/demande/${d.id}`)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow-sm hover:bg-blue-200 transition duration-200 font-medium text-sm"
                                >
                                    <Info className="w-4 h-4" /> Voir les détails
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemandesClient;
