import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import axios from "axios";
import { Loader2, Home, MapPin, Save, XCircle, ArrowLeft, Edit } from "lucide-react";

// Interface pour les détails de la boutique
interface ShopDetail {
    id: number;
    name: string;
    address: string;
    shop_owner_id: number; // C'est l'ID de la table 'shop_owner'
    created_at: string;
}

// Interface pour la structure de la réponse de l'API lors de la récupération
interface ApiResponse {
    message: string;
    shop: ShopDetail;
}

// Interface pour le type d'utilisateur dans votre contexte,
// en ajoutant shop_owner_id si le rôle est 'shop-owner'
interface UserContextUser {
    id: number;
    role?: string;
    token?: string;
    shop_owner_id?: number; // <-- IMPORTANT : doit être présent dans le UserContext
    // ... autres propriétés de l'utilisateur
}

// Interface pour le type de contexte utilisateur
interface UserContextType {
    user: UserContextUser | null;
    setUser: (user: UserContextUser | null) => void;
    loading: boolean;
    mode: "client" | "pro";
    setMode: (mode: "client" | "pro") => void;
    hasProAccount: boolean;
}


const EditShopDetails = () => {
    console.log("--- EditShopDetails Component Render START ---");
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUserContext() as UserContextType;


    const [shop, setShop] = useState<ShopDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", address: "" });
    const [submitting, setSubmitting] = useState(false); // Pour l'état de soumission du formulaire

    useEffect(() => {
        const fetchShopDetails = async () => {
            setLoading(true);
            setError(null);
            setShop(null);

            console.log("--- EditShopDetails useEffect fetch START ---");
            console.log("1. User from context at useEffect start:", user);
            console.log("2. Shop ID from URL:", id);


            try {
                if (!user?.token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    console.log("--- EditShopDetails useEffect END (No token) ---");
                    return;
                }
                if (!id) {
                    setError("ID de boutique manquant dans l'URL.");
                    setLoading(false);
                    console.log("--- EditShopDetails useEffect END (No ID) ---");
                    return;
                }

                const response = await axios.get<ApiResponse>(`${API_URL}/shops/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                console.log("3. EditShopDetails: API Response for shop details:", response.data);


                if (response.status === 200 && response.data && response.data.shop) {
                    const fetchedShop = response.data.shop;
                    setShop(fetchedShop);
                    setFormData({ name: fetchedShop.name, address: fetchedShop.address });

                    // --- DEBUG AUTORISATION (EditShopDetails useEffect - après récupération de la boutique) ---
                    console.log("--- DEBUG AUTORISATION (EditShopDetails useEffect - après fetch) ---");
                    console.log("User ID from context (user.id):", user?.id);
                    console.log("User Role from context (user.role):", user?.role);
                    console.log("User Shop Owner ID from context (user.shop_owner_id):", user?.shop_owner_id);
                    console.log("Shop owner ID from fetched shop (shop.shop_owner_id):", fetchedShop.shop_owner_id);
                    console.log("Condition: user.role === 'shop-owner'", user?.role === "shop-owner");
                    console.log("Condition: fetchedShop.shop_owner_id === user?.shop_owner_id", fetchedShop.shop_owner_id === user?.shop_owner_id);
                    console.log("Combined condition (isOwner logic):", (user?.role === "shop-owner" && fetchedShop.shop_owner_id === user?.shop_owner_id));
                    console.log("---------------------------------------------------");


                    // Vérification de l'autorisation: seul le propriétaire de la boutique (via son shop_owner_id) peut modifier
                    if (user.role !== "shop-owner" || fetchedShop.shop_owner_id !== user.shop_owner_id) {
                        setError("Accès non autorisé. Vous n'êtes pas le propriétaire de cette boutique.");
                        setShop(null); // Cache les détails si non autorisé
                    }

                } else {
                    console.error("❌ EditShopDetails: API response data or shop property missing.");
                    throw new Error(response.data?.message || "Erreur lors de la récupération des détails de la boutique.");
                }

            } catch (err: unknown) {
                console.error("❌ EditShopDetails: Error in EditShopDetails fetchShopDetails:", err);
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    setError(err.response.data.message);
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Erreur serveur lors du chargement de la boutique.");
                }
            } finally {
                setLoading(false);
                console.log("--- EditShopDetails useEffect fetch END ---");
            }
        };

        if (user?.token && id) {
            fetchShopDetails();
        } else if (!user?.token) {
            setLoading(false);
            setError("Veuillez vous connecter pour modifier la boutique.");
        } else if (!id) {
            setLoading(false);
            setError("ID de boutique non fourni.");
        }
    }, [id, user]);

    // Gère les changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: { name: string; address: string }) => ({ ...prev, [name]: value }));
    };

    // Gère la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shop) return;

        setSubmitting(true);
        setError(null);

        try {
            const token = user?.token;
            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                setSubmitting(false);
                return;
            }

            const response = await axios.patch(`${API_URL}/shops/${shop.id}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log("✅ Boutique mise à jour avec succès.");
                navigate(`/mes-boutiques/${shop.id}`); // Redirige vers la page de détails après la mise à jour
            } else {
                throw new Error(response.data?.message || "Erreur lors de la mise à jour de la boutique.");
            }

        } catch (err: unknown) {
            console.error("❌ EditShopDetails: Error during form submission:", err);
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erreur serveur lors de la mise à jour de la boutique.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Vérifie si l'utilisateur est le propriétaire de la boutique
    const isOwner = user?.role === "shop-owner" && shop?.shop_owner_id === user?.shop_owner_id;

    console.log("--- EditShopDetails Component Render END ---");
    console.log("Final isOwner calculated:", isOwner);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-[#2C3E50] text-center drop-shadow-sm flex-grow flex items-center gap-3">
                        <Edit className="w-8 h-8 text-[#3498DB]" /> Modifier la boutique
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" /> Retour
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
                            <ArrowLeft className="w-5 h-5" /> Retour
                        </button>
                    </div>
                ) : !shop || !isOwner ? ( // Si pas de boutique ou pas propriétaire
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">Accès non autorisé ou boutique introuvable.</p>
                        <p className="mt-2 text-gray-600">Vous ne pouvez pas modifier cette boutique.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" /> Retour
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Home className="inline-block w-5 h-5 text-[#3498DB] mr-2" /> Nom de la boutique
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#3498DB] focus:border-[#3498DB] sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline-block w-5 h-5 text-[#3498DB] mr-2" /> Adresse de la boutique
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#3498DB] focus:border-[#3498DB] sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/mes-boutiques/${shop.id}`)} // Retourne aux détails
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold shadow-md hover:bg-gray-300 transition duration-200"
                            >
                                <XCircle className="w-5 h-5" />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md transition-colors duration-200
                                    ${submitting
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-[#3498DB] text-white hover:bg-[#2980B9]"
                                }`}
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditShopDetails;
