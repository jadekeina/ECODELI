import { useEffect, useState, useMemo } from "react";
import API_URL from "@/config";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { Loader2, Package, Euro, MapPin, Calendar, Clock, User, Truck } from "lucide-react";

// Mise à jour de l'interface pour inclure delivery_driver_id
type ShopOwnerRequest = {
    id: number;
    title: string;
    type: string;
    description: string;
    poids: number;
    longueur: number;
    largeur: number;
    hauteur: number;
    photo: string | null;
    adresse_livraison: string;
    date_livraison: string;
    heure_livraison: string;
    prix: string;
    statut: string;
    created_at: string;
    destinataire_nom: string;
    destinataire_prenom: string;
    shop_id: number | null;
    delivery_driver_id: number | null;
    shop_name?: string;
    shop_address?: string;
};

const ShopOwnerOffers = () => {
    const [offers, setOffers] = useState<ShopOwnerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserContext();
    const [currentDriverId, setCurrentDriverId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<"all" | "en_attente" | "en_cours" | "terminee">("all");

    useEffect(() => {
        const fetchOffersAndDriverId = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            try {
                // 1. Récupérer l'ID réel du livreur
                let fetchedDriverId: number | null = null;
                if (user?.role === 'delivery-driver' && user?.id) {
                    try {
                        const driverRes = await axios.get<{ id: number; user_id: number; statut_validation: string }>(
                            `${API_URL}/delivery-driver/by-user/${user.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (driverRes.data && driverRes.data.id) {
                            fetchedDriverId = driverRes.data.id;
                            setCurrentDriverId(fetchedDriverId);
                            console.log("🚚 ID du livreur connecté (delivery_driver.id) :", fetchedDriverId);
                        } else {
                            setError("Votre profil de livreur n'est pas complet ou introuvable. Impossible d'afficher les offres.");
                            setLoading(false);
                            return;
                        }
                    } catch (driverError: any) {
                        console.error("❌ Erreur lors de la récupération du profil livreur :", driverError);
                        setError("Erreur lors du chargement de votre profil livreur.");
                        setLoading(false);
                        return;
                    }
                } else {
                    setError("Accès non autorisé : Seuls les livreurs peuvent voir ces offres.");
                    setLoading(false);
                    return;
                }

                // 2. Récupérer toutes les offres pertinentes depuis le backend
                // C'est l'appel correct pour la liste des offres
                const offersRes = await axios.get<ShopOwnerRequest[]>(`${API_URL}/shopowner-requests/available`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setOffers(offersRes.data);
                console.log("➡️ OFFRES BRUTES REÇUES DU BACKEND:", offersRes.data);

            } catch (err: any) {
                console.error("❌ Erreur de récupération des offres commerçants :", err);
                setError(err.response?.data?.message || "Erreur lors de la récupération des offres.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffersAndDriverId();
    }, [user]);

    // Utilisation de useMemo pour filtrer les offres en fonction du statut et de l'assignation
    const filteredAndAssignedOffers = useMemo(() => {
        if (!currentDriverId && user?.role === 'delivery-driver') {
            return [];
        }

        const filtered = offers.filter(offer => {
            const isAssignedToMe = offer.delivery_driver_id === currentDriverId;
            const isNotAssigned = offer.delivery_driver_id === null;

            switch (filterStatus) {
                case "all":
                    return (offer.statut === 'en_attente' && isNotAssigned) ||
                        (offer.statut === 'en_cours' && isAssignedToMe) ||
                        (offer.statut === 'terminee' && isAssignedToMe);
                case "en_attente":
                    return offer.statut === 'en_attente' && isNotAssigned;
                case "en_cours":
                    return offer.statut === 'en_cours' && isAssignedToMe;
                case "terminee":
                    return offer.statut === 'terminee' && isAssignedToMe;
                default:
                    return false;
            }
        });

        console.log(`➡️ OFFRES FILTRÉES (filtre: ${filterStatus}, livreur: ${currentDriverId}):`, filtered);
        return filtered;
    }, [offers, filterStatus, currentDriverId, user]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin w-10 h-10 text-[#1B4F3C]" />
                <p className="ml-3 text-lg text-gray-600">Chargement des offres disponibles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-lg text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8 font-inter">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-[#1B4F3C] mb-8 text-center drop-shadow-sm">
                    📦 Offres commerçants disponibles
                </h1>

                {/* Boutons de filtrage améliorés */}
                <div className="flex flex-wrap justify-center gap-3 mb-8 p-4 bg-white rounded-2xl shadow-lg">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105
                            ${filterStatus === "all"
                            ? "bg-[#1B4F3C] text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Toutes les offres
                    </button>
                    <button
                        onClick={() => setFilterStatus("en_attente")}
                        className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105
                            ${filterStatus === "en_attente"
                            ? "bg-yellow-500 text-white shadow-lg"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                    >
                        En attente
                    </button>
                    <button
                        onClick={() => setFilterStatus("en_cours")}
                        className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105
                            ${filterStatus === "en_cours"
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                        }`}
                    >
                        En cours
                    </button>
                    <button
                        onClick={() => setFilterStatus("terminee")}
                        className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105
                            ${filterStatus === "terminee"
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                    >
                        Terminée
                    </button>
                </div>

                {filteredAndAssignedOffers.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-200">
                        <p className="text-2xl text-gray-600 font-medium">
                            Aucune offre disponible pour le moment selon les filtres appliqués.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAndAssignedOffers.map((offer) => (
                            <div key={offer.id} className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 flex flex-col h-full">
                                <h2 className="text-xl font-bold text-[#1B4F3C] mb-2">{offer.title}</h2>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{offer.description || "Pas de description."}</p>

                                <div className="space-y-2 text-gray-700 text-base mb-4">
                                    <p className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium">Type :</span> {offer.type}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Euro className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium">Prix :</span> {offer.prix} €
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium">Livraison :</span> {offer.adresse_livraison}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium">Date :</span> {offer.date_livraison.substring(0, 10)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium">Heure :</span> {offer.heure_livraison}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">Destinataire :</span> {offer.destinataire_prenom} {offer.destinataire_nom}
                                    </p>
                                    {offer.shop_name && (
                                        <p className="flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-emerald-600" />
                                            <span className="font-medium">Boutique :</span> {offer.shop_name}
                                        </p>
                                    )}
                                    <p className="flex items-center gap-2">
                                        <span className="font-medium">Statut :</span>{" "}
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                                            offer.statut === "en_attente" ? "bg-yellow-100 text-yellow-800" :
                                                offer.statut === "en_cours" ? "bg-purple-100 text-purple-800" :
                                                    offer.statut === "terminee" ? "bg-green-100 text-green-800" :
                                                        "bg-gray-100 text-gray-800"
                                        }`}>
                                            {offer.statut.replace("_", " ")}
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-auto flex justify-end">
                                    <Link
                                        to={`/livraisons/offre/${offer.id}`}
                                        className="px-6 py-3 text-lg bg-[#1B4F3C] text-white rounded-xl shadow-md hover:bg-[#142D2D] transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Voir les détails
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopOwnerOffers;
