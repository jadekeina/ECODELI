import { useEffect, useState, useCallback } from "react"; // AJOUT DE useCallback
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "@/config";
import axios from "axios";
import {
    Loader2, Package, Ruler, MapPin, Calendar, Clock, Euro, User, Trash2, Edit, ArrowLeft, Info,
} from "lucide-react";
import ConfirmationModal from "@/components/provider/ConfirmationModal";
import { useUserContext } from "@/contexts/UserContext";

interface Annonce {
    id: number;
    title: string;
    type: string;
    description: string;
    poids: string;
    longueur: string;
    largeur: string;
    hauteur: string;
    adresse_livraison: string;
    date_livraison: string;
    heure_livraison: string;
    prix: string;
    destinataire_nom: string;
    destinataire_prenom: string;
    photo: string;
    statut: string;
    created_at: string;
    user_id: number;
}

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

const AnnonceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [annonce, setAnnonce] = useState<Annonce | null>(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalConfirmAction, setModalConfirmAction] = useState<(() => void) | null>(null);
    const [modalType, setModalType] = useState<'confirm' | 'alert' | 'success' | 'error'>('confirm');


    // CORRECTION ICI : Utilisation de useCallback pour mémoïser fetchAnnonce
    const fetchAnnonce = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setModalTitle("Erreur d'authentification");
                setModalMessage("Token d'authentification manquant. Veuillez vous reconnecter.");
                setModalType('error');
                setModalConfirmAction(() => () => setIsModalOpen(false));
                setIsModalOpen(true);
                setLoading(false);
                return;
            }

            const annonceRes = await axios.get(`${API_URL}/shopowner-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAnnonce(annonceRes.data);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Erreur fetch:", err);
            setModalTitle("Erreur de chargement");
            setModalMessage(err.response?.data?.message || "Impossible de charger les détails de l'annonce.");
            setModalType('error');
            setModalConfirmAction(() => () => setIsModalOpen(false));
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [id]); // Dépendances de useCallback: id (car l'URL de fetch dépend de l'ID)

    useEffect(() => {
        fetchAnnonce();
    }, [id, fetchAnnonce]); // Dépendances de useEffect: id et la fonction mémoïsée

    // Fonction pour ouvrir le modal de confirmation de suppression
    const confirmDelete = () => {
        setModalTitle("Confirmer la suppression");
        setModalMessage("Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.");
        setModalType('confirm');
        setModalConfirmAction(() => handleDelete);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        setIsModalOpen(false);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setModalTitle("Erreur d'authentification");
                setModalMessage("Vous n'êtes pas authentifié. Veuillez vous reconnecter.");
                setModalType('error');
                setModalConfirmAction(() => () => setIsModalOpen(false));
                setIsModalOpen(true);
                return;
            }

            await axios.delete(`${API_URL}/shopowner-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setModalTitle("Succès !");
            setModalMessage("Annonce supprimée avec succès.");
            setModalType('success');
            setModalConfirmAction(() => () => { setIsModalOpen(false); navigate("/mes-annonces"); });
            setIsModalOpen(true);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Erreur suppression:", err);
            setModalTitle("Erreur de suppression");
            setModalMessage(`Erreur lors de la suppression : ${err.response?.data?.message || "Une erreur est survenue."}`);
            setModalType('error');
            setModalConfirmAction(() => () => setIsModalOpen(false));
            setIsModalOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <Loader2 className="animate-spin w-10 h-10 text-[#155250]" />
                <p className="ml-3 text-base text-gray-600">Chargement des détails de l'annonce...</p>
            </div>
        );
    }

    if (!annonce && !isModalOpen) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-base text-gray-600">Annonce introuvable.</p>
            </div>
        );
    }

    // Vérifie si l'utilisateur connecté est le propriétaire de l'annonce
    const isOwner = user?.id === annonce?.user_id;

    // Fonction pour gérer l'erreur de chargement d'image
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "https://placehold.co/400x250/E9FADF/155250?text=Image+non+disponible";
        e.currentTarget.onerror = null;
    };

    return (
        <div className="min-h-screen bg-white p-6 font-inter">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-[#142D2D] drop-shadow-sm flex items-center gap-2">
                        <Info className="w-7 h-7 text-[#142D2D]" /> Détails de l'Annonce
                    </h1>
                    <button
                        onClick={() => navigate("/mes-annonces")}
                        className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md shadow-sm hover:bg-gray-300 transition duration-200 font-medium text-xs"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                </div>

                {/* Image de l'annonce */}
                <div className="mb-4">
                    <img
                        src={`${API_URL}${annonce?.photo}`}
                        alt={`Photo de l'annonce: ${annonce?.title}`}
                        className="w-full h-56 object-cover rounded-xl shadow-md border border-gray-200"
                        onError={handleImageError}
                    />
                </div>

                {/* Titre et statut */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-[#155250]">{annonce?.title}</h2>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                            statusColorMap[annonce?.statut || 'default'] || statusColorMap.default
                        }`}
                    >
                        {annonce?.statut.replace('_', ' ')}
                    </span>
                </div>

                <div className="space-y-3 text-gray-700 text-base">
                    {/* Type */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                        <Package className="w-5 h-5 text-emerald-600" />
                        <p>
                            <strong className="font-semibold text-[#142D2D]">Type :</strong> {annonce?.type}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                        <p className="flex items-center gap-2 mb-1.5">
                            <Info className="w-5 h-5 text-emerald-600" />
                            <strong className="font-semibold text-[#142D2D]">Description :</strong>
                        </p>
                        <p className="ml-7 text-gray-800 leading-normal text-sm">
                            {annonce?.description || "Aucune description fournie pour cette annonce."}
                        </p>
                    </div>

                    {/* Poids et Dimensions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                            <Ruler className="w-5 h-5 text-emerald-600" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Poids :</strong> {annonce?.poids} kg
                            </p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                            <Ruler className="w-5 h-5 text-emerald-600" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Dimensions :</strong> {annonce?.longueur} x {annonce?.largeur} x {annonce?.hauteur} cm
                            </p>
                        </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                        <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <p>
                            <strong className="font-semibold text-[#142D2D]">Adresse de livraison :</strong> {annonce?.adresse_livraison}
                        </p>
                    </div>

                    {/* Date et Heure de livraison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Date de livraison :</strong> {annonce?.date_livraison}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <p>
                                <strong className="font-semibold text-[#142D2D]">Heure de livraison :</strong> {annonce?.heure_livraison}
                            </p>
                        </div>
                    </div>

                    {/* Prix proposé */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                        <Euro className="w-5 h-5 text-emerald-600" />
                        <p>
                            <strong className="font-semibold text-[#142D2D]">Prix proposé :</strong>{" "}
                            <span className="text-lg font-bold text-green-700">
                                {parseFloat(annonce?.prix || '0').toFixed(2)} €
                            </span>
                        </p>
                    </div>

                    {/* Destinataire */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                        <User className="w-5 h-5 text-gray-500" />
                        <p>
                            <strong className="font-semibold text-[#142D2D]">Destinataire :</strong> {annonce?.destinataire_prenom} {annonce?.destinataire_nom}
                        </p>
                    </div>

                    {/* Date de création de l'annonce */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <p className="text-sm">
                            <strong className="font-semibold text-[#142D2D]">Annonce créée le :</strong>{" "}
                            {annonce?.created_at ? new Date(annonce.created_at).toLocaleDateString("fr-FR") : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Boutons d'action */}
                {isOwner && (
                    <div className="flex justify-center gap-3 mt-8">
                        <button
                            onClick={() => navigate(`/annonces/edit/${id}`)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-100 text-blue-700 rounded-lg shadow-sm hover:bg-blue-200 transition duration-300 ease-in-out transform hover:scale-105 font-medium text-base"
                        >
                            <Edit className="w-4 h-4" /> Modifier
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-100 text-red-700 rounded-lg shadow-sm hover:bg-red-200 transition duration-300 ease-in-out transform hover:scale-105 font-medium text-base"
                        >
                            <Trash2 className="w-4 h-4" /> Supprimer
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de confirmation/alerte */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={modalConfirmAction || (() => setIsModalOpen(false))}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                confirmText={modalType === 'confirm' ? 'Oui, supprimer' : 'OK'}
                cancelText="Non, annuler"
            />
        </div>
    );
};

export default AnnonceDetails;
