import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Package, Ruler, MapPin, Calendar, Clock, Euro, User, CheckCircle, XCircle, ArrowLeft, Info, Truck } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";

// Définition de l'interface pour une meilleure typage
interface Annonce {
    id: number;
    title: string;
    type: string;
    description: string;
    poids: number;
    longueur: number;
    largeur: number;
    hauteur: number;
    adresse_livraison: string;
    date_livraison: string;
    heure_livraison: string;
    prix: string;
    destinataire_nom: string;
    destinataire_prenom: string;
    photo: string;
    statut: string;
    created_at: string;
    shop_name?: string;
    shop_address?: string;
    delivery_driver_id?: number | null;
}

// Mappage des statuts aux couleurs Tailwind CSS
const statusColorMap: { [key: string]: string } = {
    en_attente: "bg-yellow-100 text-yellow-800",
    acceptee: "bg-blue-100 text-blue-800",
    refusee: "bg-red-100 text-red-800",
    en_cours: "bg-purple-100 text-purple-800",
    terminee: "bg-green-100 text-green-800",
    annulee: "bg-gray-100 text-gray-800",
    ignoree: "bg-gray-200 text-gray-700",
    default: "bg-gray-200 text-gray-700",
};

export default function ShopOwnerRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUserContext(); // Récupère l'utilisateur du contexte
    const [annonce, setAnnonce] = useState<Annonce | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // État pour stocker l'ID du livreur réel (delivery_driver.id)
    const [currentDeliveryDriverId, setCurrentDeliveryDriverId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAnnonceAndDriverId = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }

                // 1. Récupérer les détails de l'annonce
                const annonceRes = await axios.get(`http://localhost:3002/shopowner-requests/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnonce(annonceRes.data);
                console.log("📢 Annonce récupérée :", annonceRes.data);

                // 2. Si l'utilisateur est un livreur, récupérer son ID de livreur réel
                if (user?.role === 'delivery-driver' && user?.id) {
                    try {
                        // Appel à la nouvelle route backend que vous avez configurée
                        const driverRes = await axios.get(`http://localhost:3002/delivery-driver/by-user/${user.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (driverRes.data && driverRes.data.id) {
                            setCurrentDeliveryDriverId(driverRes.data.id);
                            console.log("🚚 ID du livreur connecté (delivery_driver.id) :", driverRes.data.id);
                        } else {
                            console.warn("⚠️ Aucun ID de livreur trouvé pour l'utilisateur connecté.");
                            setError("Votre profil de livreur n'est pas complet. Impossible d'accepter des commandes.");
                        }
                    } catch (driverError: any) {
                        console.error("❌ Erreur lors de la récupération du profil livreur :", driverError);
                        if (!error) { // Seulement si aucune erreur n'est déjà présente
                            setError(driverError.response?.data?.message || "Erreur lors du chargement de votre profil livreur.");
                        }
                    }
                }

            } catch (error: any) {
                console.error("❌ Erreur lors de la récupération de l'annonce :", error);
                setError(error.response?.data?.message || "Erreur lors du chargement de l'annonce.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnonceAndDriverId();
    }, [id, user, error]); // Dépendance à 'user' et 'error' pour recharger si le profil ou l'erreur change

    const updateStatus = async (newStatus: string) => {
        // La condition vérifie si currentDeliveryDriverId est null SEULEMENT si newStatus est "en_cours"
        if (!id || !user?.id || (newStatus === "en_cours" && currentDeliveryDriverId === null)) {
            setError("Impossible de mettre à jour le statut : ID d'annonce, d'utilisateur ou de livreur manquant.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                return;
            }

            const payload: { status: string; delivery_driver_id?: number | null } = { status: newStatus };

            if (newStatus === "en_cours") {
                payload.delivery_driver_id = currentDeliveryDriverId; // Utilisation du VRAI ID du livreur
            } else if (newStatus === "ignoree" || newStatus === "terminee" || newStatus === "annulee") {
                payload.delivery_driver_id = null;
            }

            await axios.patch(
                `http://localhost:3002/shopowner-requests/${id}/status`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAnnonce((prevAnnonce) => ({
                ...prevAnnonce!,
                status: newStatus,
                delivery_driver_id: payload.delivery_driver_id,
            }));
            console.log(`✅ Statut de l'annonce mis à jour à : ${newStatus}`);
        } catch (error: any) {
            console.error("❌ Erreur lors de la mise à jour du statut :", error);
            setError(error.response?.data?.message || "Erreur lors de la mise à jour du statut.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <Loader2 className="animate-spin w-10 h-10 text-[#155250]" />
                <p className="ml-3 text-lg text-gray-600">Chargement des détails de la commande...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-lg text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    if (!annonce) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-lg text-gray-600">Aucune annonce trouvée pour cet ID.</p>
            </div>
        );
    }

    // Fonction pour gérer l'erreur de chargement d'image
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "https://placehold.co/600x400/E9FADF/155250?text=Image+non+disponible";
        e.currentTarget.onerror = null;
    };

    // Débugging des conditions des boutons
    console.log("--- Statut de l'annonce pour les boutons ---");
    console.log("Annonce ID:", annonce.id);
    console.log("Annonce statut:", annonce.statut);
    console.log("Annonce delivery_driver_id:", annonce.delivery_driver_id);
    console.log("User ID (from context):", user?.id);
    console.log("Current Delivery Driver ID (from DB):", currentDeliveryDriverId); // NOUVEAU LOG
    const isMine = annonce.delivery_driver_id === currentDeliveryDriverId; // Comparaison avec le VRAI ID du livreur
    console.log("isMine (delivery_driver.id === currentDeliveryDriverId):", isMine);
    console.log("Condition 'en_attente' (annonce.statut === 'en_attente'):", annonce.statut === "en_attente");
    console.log("Condition 'en_cours' et 'isMine' (isMine && annonce.statut === 'en_cours'):", isMine && annonce.statut === "en_cours");
    console.log("-------------------------------------------");


    const origin = annonce.shop_address;
    const destination = annonce.adresse_livraison;
    const mapUrl =
        origin && destination && import.meta.env.VITE_Maps_API_KEY
            ? `https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_Maps_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`
            : null;

    return (
        <div className="min-h-screen bg-white p-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#142D2D] drop-shadow-sm flex items-center gap-3">
                        <Package className="w-9 h-9 text-[#142D2D]" /> Commande Client #{annonce.id}
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition duration-200 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </button>
                </div>

                {/* Section des boutons d'action */}
                <div className="flex justify-end items-center gap-3 mb-6">
                    {annonce.statut === "en_attente" && (
                        <>
                            <button
                                className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md"
                                onClick={() => updateStatus("en_cours")}
                            >
                                <CheckCircle className="w-5 h-5" /> Accepter
                            </button>
                            <button
                                className="inline-flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition duration-200 shadow-md"
                                onClick={() => updateStatus("ignoree")}
                            >
                                <XCircle className="w-5 h-5" /> Ignorer
                            </button>
                        </>
                    )}

                    {isMine && annonce.statut === "en_cours" && (
                        <button
                            className="inline-flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
                            onClick={() => updateStatus("terminee")}
                        >
                            <Truck className="w-5 h-5" /> Marquer comme terminée
                        </button>
                    )}

                    {/* Affichage du statut actuel si aucun bouton n'est affiché */}
                    {annonce.statut !== "en_attente" && !(isMine && annonce.statut === "en_cours") && (
                        <span className={`px-4 py-2 rounded-lg text-base font-semibold uppercase ${
                            statusColorMap[annonce.statut] || statusColorMap.default
                        }`}>
                            Statut: {annonce.statut.replace('_', ' ')}
                        </span>
                    )}
                </div>

                {/* Image de l'annonce */}
                {annonce.photo && (
                    <div className="mb-6">
                        <img
                            src={`http://localhost:3002${annonce.photo}`}
                            alt={`Photo de l'annonce: ${annonce.title}`}
                            className="w-full h-72 object-cover rounded-xl shadow-md border border-gray-200"
                            onError={handleImageError}
                        />
                    </div>
                )}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Colonne de gauche - Informations générales */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <Package className="w-6 h-6 text-emerald-600" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Type :</strong> {annonce.type}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                                statusColorMap[annonce.statut] || statusColorMap.default
                            }`}>
                                Statut: {annonce.statut.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <Euro className="w-6 h-6 text-emerald-600" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Prix proposé :</strong>{" "}
                                <span className="text-xl font-bold text-green-700">
                                    {parseFloat(annonce.prix).toFixed(2)} €
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <Ruler className="w-6 h-6 text-emerald-600" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Poids :</strong> {annonce.poids} kg
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <Ruler className="w-6 h-6 text-emerald-600" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Dimensions :</strong> {annonce.longueur} x {annonce.largeur} x {annonce.hauteur} cm
                            </p>
                        </div>
                    </div>

                    {/* Colonne de droite - Informations de livraison et destinataire */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <Calendar className="w-6 h-6 text-gray-500" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Date de livraison :</strong> {annonce.date_livraison?.slice(0, 10)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <Clock className="w-6 h-6 text-gray-500" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Heure de livraison :</strong> {annonce.heure_livraison}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <User className="w-6 h-6 text-gray-500" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Destinataire :</strong> {annonce.destinataire_prenom} {annonce.destinataire_nom}
                            </p>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <MapPin className="w-6 h-6 text-emerald-600 mt-0.5" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Adresse de livraison :</strong> {destination}
                            </p>
                        </div>
                        {annonce.shop_name && (
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <Truck className="w-6 h-6 text-emerald-600 mt-0.5" />
                                <p>
                                    <strong className="font-semibold text-[#142D2D]">Boutique :</strong> {annonce.shop_name}
                                    {annonce.shop_address && <span className="block text-sm text-gray-600">{annonce.shop_address}</span>}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section de la carte */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-[#142D2D] mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-[#142D2D]" /> Itinéraire de livraison
                    </h3>
                    {mapUrl ? (
                        <iframe
                            width="100%"
                            height="400"
                            loading="lazy"
                            className="rounded-xl border border-gray-300"
                            allowFullScreen
                            src={mapUrl}
                        ></iframe>
                    ) : (
                        <p className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            Carte indisponible : Adresse de départ ou de destination manquante, ou clé API Google Maps non configurée.
                        </p>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-md hover:bg-gray-300 transition duration-200 font-medium">
                        <ArrowLeft className="w-5 h-5" /> Retour à la liste
                    </button>
                </div>
            </div>
        </div>
    );
}
