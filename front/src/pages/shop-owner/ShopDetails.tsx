import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import axios from "axios";
import { Loader2, Home, MapPin, Edit, Trash2 } from "lucide-react"; // Ajout de Trash2

// Interface pour les détails de la boutique tels que renvoyés par l'API
interface ShopDetail {
    id: number;
    name: string;
    address: string;
    shop_owner_id: number;
    created_at: string;
    // Ajoutez d'autres champs si votre API les fournit
}

// Interface pour la structure complète de la réponse de l'API
interface ApiResponse {
    message: string;
    shop: ShopDetail; // La boutique est imbriquée sous la propriété 'shop'
}

const ShopDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [shop, setShop] = useState<ShopDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false); // État pour le chargement de la suppression
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // État pour la confirmation de suppression

    useEffect(() => {
        const fetchShopDetails = async () => {
            setLoading(true);
            setError(null);
            setShop(null);

            try {
                if (!user?.token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }

                if (!id) {
                    setError("ID de boutique manquant dans l'URL.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get<ApiResponse>(`${API_URL}/shops/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (response.status === 200 && response.data && response.data.shop) {
                    setShop(response.data.shop);
                    console.log("✅ Détails de la boutique récupérés (dans useEffect):", response.data.shop);
                } else {
                    throw new Error(response.data?.message || "Erreur lors de la récupération des détails de la boutique.");
                }

            } catch (err: any) {
                console.error("❌ Erreur lors du chargement des détails de la boutique :", err);
                setError(err.response?.data?.message || "Erreur serveur lors du chargement de la boutique.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.token && id) {
            fetchShopDetails();
        } else if (!user?.token) {
            setLoading(false);
            setError("Veuillez vous connecter pour voir les détails de la boutique.");
        } else if (!id) {
            setLoading(false);
            setError("ID de boutique non fourni.");
        }
    }, [id, user]);

    // Fonction pour gérer la navigation vers la page de modification
    const handleEditClick = () => {
        if (shop) {
            navigate(`/mes-boutiques/modifier/${shop.id}`); // Adaptez cette route si nécessaire
        }
    };

    // Fonction pour gérer la suppression de la boutique
    const handleDeleteClick = async () => {
        if (!shop) return;

        // Affiche la confirmation
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirmation(false); // Cache la confirmation
        setDeleting(true); // Active l'état de suppression

        try {
            const token = user?.token;
            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                setDeleting(false);
                return;
            }

            const response = await axios.delete(`${API_URL}/shops/${shop?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log("✅ Boutique supprimée avec succès.");
                navigate("/mes-boutiques"); // Redirige vers la liste des boutiques après suppression
            } else {
                throw new Error(response.data?.message || "Erreur lors de la suppression de la boutique.");
            }
        } catch (err: any) {
            console.error("❌ Erreur lors de la suppression de la boutique :", err);
            setError(err.response?.data?.message || "Erreur serveur lors de la suppression de la boutique.");
        } finally {
            setDeleting(false); // Désactive l'état de suppression
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false); // Annule la confirmation
    };

    // Vérifie si l'utilisateur est un shop-owner pour afficher les boutons d'action
    const isShopOwner = user?.role === "shop-owner" && shop?.shop_owner_id === user?.id;


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-[#2C3E50] text-center drop-shadow-sm flex-grow flex items-center gap-3">
                        <Home className="w-8 h-8 text-[#3498DB]" /> Détails de la boutique
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
                    >
                        Retour
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin w-10 h-10 text-[#2C3E50]" />
                        <p className="ml-3 text-lg text-gray-600">Chargement des détails de la boutique...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
                        <p className="font-medium text-lg">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                        >
                            Retour
                        </button>
                    </div>
                ) : !shop ? (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">Aucune boutique trouvée pour cet ID.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                            Retour
                        </button>
                    </div>
                ) : (
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                <Home className="w-6 h-6 text-[#3498DB]" />
                                <p className="text-lg text-gray-800">
                                    <span className="font-semibold">Nom :</span> {shop.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                <MapPin className="w-6 h-6 text-[#3498DB]" />
                                <p className="text-lg text-gray-800">
                                    <span className="font-semibold">Adresse :</span> {shop.address}
                                </p>
                            </div>
                        </div>

                        {isShopOwner && ( // Affiche les boutons uniquement si l'utilisateur est le propriétaire de la boutique
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={handleEditClick}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#28A745] text-white rounded-lg font-bold shadow-md hover:bg-[#218838] transition duration-200"
                                >
                                    <Edit className="w-5 h-5" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    disabled={deleting}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md transition-colors duration-200
                                        ${deleting
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {deleting ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    Supprimer
                                </button>
                            </div>
                        )}

                        {showDeleteConfirmation && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                                    <p className="text-lg font-semibold mb-6">Êtes-vous sûr de vouloir supprimer cette boutique ?</p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={confirmDelete}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition duration-200"
                                        >
                                            Oui, Supprimer
                                        </button>
                                        <button
                                            onClick={cancelDelete}
                                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition duration-200"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopDetails;
