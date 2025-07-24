import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "@/config";
import AutocompleteInput from "@/components/AutoCompleteInput";
import axios from "axios";
import {
    Loader2, MapPin, Calendar, Clock, Euro, User,
    Edit, Save, ArrowLeft, Store, Text, AlignLeft, Weight,
    Maximize2, Minimize2, ChevronDown
} from "lucide-react";

interface Shop {
    id: number;
    name: string;
    address: string;
}

interface FormData {
    title: string;
    description: string;
    poids: string;
    longueur: string;
    largeur: string;
    hauteur: string;
    shop_id: string;
    destinataire_nom: string;
    destinataire_prenom: string;
    adresse_livraison: string;
    date_livraison: string;
    heure_livraison: string;
    prix: string;
}

const ModifierAnnonceShopOwner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData | null>(null);
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchAnnonceAndShops = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }

                // Récupérer les boutiques
                const shopsRes = await axios.get<Shop[]>(`${API_URL}/shops/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setShops(shopsRes.data);

                // Récupérer les données de l'annonce
                const annonceRes = await axios.get<FormData>(`${API_URL}/shopowner-requests/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({
                    ...annonceRes.data,
                    date_livraison: annonceRes.data.date_livraison ? annonceRes.data.date_livraison.split('T')[0] : '',
                });

            } catch (err: any) {
                console.error("Erreur lors du chargement des données :", err);
                setError(err.response?.data?.message || "Erreur lors du chargement des données de l'annonce.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnonceAndShops().catch(console.error);
    }, [id]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (!formData) return;
        setFormData({ ...formData, [name]: value });
        setUpdateSuccess(false);
    };

    const handleAutocompleteChange = (value: string) => {
        if (!formData) return;
        setFormData({ ...formData, adresse_livraison: value });
        setUpdateSuccess(false);
    };

    const handleUpdate = async () => {
        setError(null);
        setUpdateSuccess(false);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                return;
            }

            const payload = {
                title: formData?.title,
                description: formData?.description,
                poids: formData?.poids,
                longueur: formData?.longueur,
                largeur: formData?.largeur,
                hauteur: formData?.hauteur,
                shop_id: formData?.shop_id,
                destinataire_nom: formData?.destinataire_nom,
                destinataire_prenom: formData?.destinataire_prenom,
                adresse_livraison: formData?.adresse_livraison,
                date_livraison: formData?.date_livraison,
                heure_livraison: formData?.heure_livraison,
                prix: formData?.prix,
            };

            const res = await axios.patch(`${API_URL}/shopowner-requests/${id}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                setUpdateSuccess(true);
                // AJOUT DE LA REDIRECTION APRÈS 1 SECONDE
                setTimeout(() => {
                    navigate(`/annonce/${id}`); // Redirige vers la page de détails de l'annonce
                }, 1000); // Délai de 1000 millisecondes (1 seconde)
            } else {
                setError("Erreur lors de la mise à jour de l'annonce.");
            }
        } catch (err: any) {
            console.error("Erreur lors de la mise à jour :", err);
            setError(err.response?.data?.message || "Erreur serveur lors de la mise à jour.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
                <Loader2 className="animate-spin w-10 h-10 text-[#1B4F3C]" />
                <p className="ml-3 text-lg text-gray-600">Chargement de l'annonce...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
                <p className="text-lg text-red-500 font-medium p-4 bg-red-100 rounded-lg border border-red-200">{error}</p>
            </div>
        );
    }

    if (!formData) {
        return <div className="p-8 text-center text-gray-600">Annonce introuvable.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-[#1B4F3C] mb-8 text-center drop-shadow-sm flex items-center justify-center gap-3">
                    <Edit className="w-10 h-10 text-[#1B4F3C]" /> Modifier votre annonce
                </h1>

                {updateSuccess && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center shadow-md">
                        <p className="font-medium text-lg">✅ Annonce mise à jour avec succès !</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Titre */}
                    <div>
                        <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">
                            <Text className="inline-block w-4 h-4 mr-2 text-gray-500" /> Titre de l'annonce
                        </label>
                        <input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                            placeholder="Ex: Livraison de courses urgentes"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                            <AlignLeft className="inline-block w-4 h-4 mr-2 text-gray-500" /> Description détaillée
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                            placeholder="Décrivez précisément ce qui doit être livré..."
                        />
                    </div>

                    {/* Dimensions et Poids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="poids" className="block text-gray-700 text-sm font-medium mb-2">
                                <Weight className="inline-block w-4 h-4 mr-2 text-gray-500" /> Poids (kg)
                            </label>
                            <input
                                id="poids"
                                name="poids"
                                type="number"
                                value={formData.poids}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: 5"
                            />
                        </div>
                        <div>
                            <label htmlFor="longueur" className="block text-gray-700 text-sm font-medium mb-2">
                                <Maximize2 className="inline-block w-4 h-4 mr-2 text-gray-500" /> Longueur (cm)
                            </label>
                            <input
                                id="longueur"
                                name="longueur"
                                type="number"
                                value={formData.longueur}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: 30"
                            />
                        </div>
                        <div>
                            <label htmlFor="largeur" className="block text-gray-700 text-sm font-medium mb-2">
                                <Minimize2 className="inline-block w-4 h-4 mr-2 text-gray-500" /> Largeur (cm)
                            </label>
                            <input
                                id="largeur"
                                name="largeur"
                                type="number"
                                value={formData.largeur}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: 20"
                            />
                        </div>
                        <div>
                            <label htmlFor="hauteur" className="block text-gray-700 text-sm font-medium mb-2">
                                <Maximize2 className="inline-block w-4 h-4 mr-2 text-gray-500 transform rotate-90" /> Hauteur (cm)
                            </label>
                            <input
                                id="hauteur"
                                name="hauteur"
                                type="number"
                                value={formData.hauteur}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: 15"
                            />
                        </div>
                    </div>

                    {/* Sélection de la boutique */}
                    <div>
                        <label htmlFor="shop_id" className="block text-gray-700 text-sm font-medium mb-2">
                            <Store className="inline-block w-4 h-4 mr-2 text-gray-500" /> Boutique d'origine
                        </label>
                        <div className="relative">
                            <select
                                id="shop_id"
                                name="shop_id"
                                value={formData.shop_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150 pr-10"
                            >
                                <option value="">Sélectionnez une boutique</option>
                                {shops.map((shop) => (
                                    <option key={shop.id} value={shop.id.toString()}>
                                        {shop.name} - {shop.address}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Informations destinataire */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="destinataire_nom" className="block text-gray-700 text-sm font-medium mb-2">
                                <User className="inline-block w-4 h-4 mr-2 text-gray-500" /> Nom du destinataire
                            </label>
                            <input
                                id="destinataire_nom"
                                name="destinataire_nom"
                                value={formData.destinataire_nom}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: Dupont"
                            />
                        </div>
                        <div>
                            <label htmlFor="destinataire_prenom" className="block text-gray-700 text-sm font-medium mb-2">
                                <User className="inline-block w-4 h-4 mr-2 text-gray-500" /> Prénom du destinataire
                            </label>
                            <input
                                id="destinataire_prenom"
                                name="destinataire_prenom"
                                value={formData.destinataire_prenom}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: Jean"
                            />
                        </div>
                    </div>

                    {/* Adresse, Date, Heure, Prix */}
                    <div>
                        <AutocompleteInput
                            name="adresse_livraison"
                            label="Adresse de livraison"
                            value={formData.adresse_livraison}
                            onChange={handleAutocompleteChange}
                            icon={<MapPin className="inline-block w-4 h-4 mr-2 text-gray-500" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="date_livraison" className="block text-gray-700 text-sm font-medium mb-2">
                                <Calendar className="inline-block w-4 h-4 mr-2 text-gray-500" /> Date de livraison
                            </label>
                            <input
                                id="date_livraison"
                                type="date"
                                name="date_livraison"
                                value={formData.date_livraison}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                            />
                        </div>
                        <div>
                            <label htmlFor="heure_livraison" className="block text-gray-700 text-sm font-medium mb-2">
                                <Clock className="inline-block w-4 h-4 mr-2 text-gray-500" /> Heure de livraison
                            </label>
                            <input
                                id="heure_livraison"
                                type="time"
                                name="heure_livraison"
                                value={formData.heure_livraison}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                            />
                        </div>
                        <div>
                            <label htmlFor="prix" className="block text-gray-700 text-sm font-medium mb-2">
                                <Euro className="inline-block w-4 h-4 mr-2 text-gray-500" /> Prix proposé (€)
                            </label>
                            <input
                                id="prix"
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                                placeholder="Ex: 15.00"
                            />
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5" /> Retour
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4F3C] text-white font-semibold shadow-md hover:bg-[#142D2D] transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <Save className="w-5 h-5" /> Mettre à jour l'annonce
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifierAnnonceShopOwner;
