import { useEffect, useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import { Loader2, Package, Calendar, Clock, MapPin, MessageCircle, User } from "lucide-react"; // Ajout d'icônes

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

const ProviderServiceRequests = () => {
    const { user } = useUserContext();
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Nouvel état pour les erreurs

    useEffect(() => {
        const fetchProviderRequests = async () => { // Renommé pour plus de clarté
            setLoading(true); // Démarre le chargement
            setError(null); // Réinitialise les erreurs

            try {
                if (!user?.token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    return;
                }

                console.log("🚀 Début de la récupération du profil provider...");
                // 1. Récupérer les infos du provider lié à l'utilisateur connecté
                const res = await fetch(`${API_URL}/provider/me`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Erreur lors de la récupération du profil provider.");
                }

                const data = await res.json();
                const providerId = data.provider?.id;
                console.log("✅ Profil provider récupéré. ID:", providerId);

                // 2. Une fois le provider_id récupéré, fetch les demandes
                if (providerId) {
                    console.log(`🚀 Récupération des demandes pour le provider ID: ${providerId}...`);
                    const response = await fetch(`${API_URL}/service_requests/provider/${providerId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || "Erreur lors de la récupération des demandes de prestations.");
                    }

                    const result = await response.json();
                    setRequests(result.requests);
                    console.log("✅ Demandes de prestations récupérées:", result.requests);
                } else {
                    setError("Aucun profil de prestataire trouvé pour cet utilisateur.");
                }
            } catch (err: any) { // Utilisation de 'any' pour attraper divers types d'erreurs
                console.error("❌ Erreur lors de la récupération des demandes :", err);
                setError(err.message || "Une erreur inattendue est survenue.");
            } finally {
                setLoading(false); // Arrête le chargement dans tous les cas
            }
        };

        if (user?.token) {
            fetchProviderRequests();
        } else {
            setLoading(false); // Si pas de token, on arrête le chargement immédiatement
            setError("Veuillez vous connecter pour voir vos demandes.");
        }
    }, [user]); // Dépend de l'objet user pour se déclencher quand le token est disponible

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 text-center drop-shadow-sm">
                    📋 Mes Demandes de Prestations
                </h1>

                <div className="mb-6 text-right">
                    <a
                        href="/provider/prestations/nouvelle"
                        className="inline-block bg-[#1B4F3C] hover:bg-[#164031] text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition duration-300 ease-in-out"
                    >
                        + Ajouter une prestation
                    </a>
                </div>

                <a
                    href="/provider/prestations/demandes"
                    className="inline-block mt-6 bg-[#1B4F3C] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#164031] transition duration-200"
                >
                    Gérer les statuts
                </a>



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
                        <p className="text-xl font-medium">Aucune demande de prestation pour l'instant.</p>
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
                                <p className="text-md mt-4">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase shadow-sm ${
                                        req.statut === "en_attente" ? "bg-yellow-100 text-yellow-800" :
                                            req.statut === "acceptee" ? "bg-green-100 text-green-800" :
                                                req.statut === "refusee" ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-700"
                                    }`}>
                                        Statut : {req.statut.replace("_", " ")}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderServiceRequests;
