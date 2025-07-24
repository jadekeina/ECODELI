import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { useNavigate, Link } from "react-router-dom"; // Importation de Link
import { Euro, Calendar, Edit, Trash2, PlusCircle } from "lucide-react";
import API_URL from "@/config";
import ConfirmationModal from "@/components/provider/ConfirmationModal";

interface Service {
    id: number;
    type: string;
    description: string;
    price: string;
    status: string;
    created_at: string;
}

const statusColorMap: { [key: string]: string } = {
    actif: "bg-green-100 text-green-800",
    inactif: "bg-gray-100 text-gray-600",
    en_attente: "bg-yellow-100 text-yellow-800",
};

export default function ProviderServicesList() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // États pour le modal de confirmation/alerte
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalConfirmAction, setModalConfirmAction] = useState<(() => void) | null>(null);
    const [modalType, setModalType] = useState<'confirm' | 'alert' | 'success' | 'error'>('confirm');


    // Fonction pour recharger la liste des services
    const fetchServices = async () => {
        if (!user?.id || !user?.token) {
            setLoading(false);
            setError("Utilisateur non authentifié ou informations manquantes.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/services`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setServices(data.services || []);
                setError(null);
            } else {
                setError(data.message || "Erreur lors de la récupération des prestations.");
                setModalTitle("Erreur de chargement");
                setModalMessage(data.message || "Impossible de charger vos prestations.");
                setModalType('error');
                setModalConfirmAction(() => () => setIsModalOpen(false));
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error("Erreur récupération services :", err);
            setError("Impossible de se connecter au serveur des prestations.");
            setModalTitle("Erreur de connexion");
            setModalMessage("Impossible de se connecter au serveur pour récupérer les prestations.");
            setModalType('error');
            setModalConfirmAction(() => () => setIsModalOpen(false));
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [user]);

    // Fonction pour ouvrir le modal de confirmation de suppression
    const confirmDelete = (serviceId: number) => {
        setModalTitle("Confirmer la suppression");
        setModalMessage("Êtes-vous sûr de vouloir supprimer cette prestation ? Cette action est irréversible.");
        setModalType('confirm');
        setModalConfirmAction(() => () => handleDeleteService(serviceId));
        setIsModalOpen(true);
    };

    // Nouvelle fonction pour gérer la suppression d'un service
    const handleDeleteService = async (serviceId: number) => {
        setIsModalOpen(false);
        if (!user?.token) {
            setModalTitle("Erreur d'authentification");
            setModalMessage("Vous n'êtes pas authentifié. Veuillez vous reconnecter.");
            setModalType('error');
            setModalConfirmAction(() => () => setIsModalOpen(false));
            setIsModalOpen(true);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/services/${serviceId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (res.ok) {
                setModalTitle("Succès !");
                setModalMessage("Prestation supprimée avec succès !");
                setModalType('success');
                setModalConfirmAction(() => () => { setIsModalOpen(false); fetchServices(); });
                setIsModalOpen(true);
            } else {
                const errorData = await res.json();
                setModalTitle("Erreur de suppression");
                setModalMessage(`Erreur lors de la suppression : ${errorData.message || "Une erreur est survenue."}`);
                setModalType('error');
                setModalConfirmAction(() => () => setIsModalOpen(false));
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Erreur suppression service :", error);
            setModalTitle("Erreur réseau");
            setModalMessage("Impossible de se connecter au serveur pour supprimer la prestation.");
            setModalType('error');
            setModalConfirmAction(() => () => setIsModalOpen(false));
            setIsModalOpen(true);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-gray-600">Chargement des prestations...</p>
            </div>
        );
    }

    if (error && !isModalOpen) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-5xl mx-auto">
                {/* En-tête de la page */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-extrabold text-[#2C3E50] drop-shadow-sm">
                        Mes Prestations
                    </h2>
                    <a
                        href="/provider/prestations/nouvelle"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#3498DB] text-white rounded-xl shadow-md hover:bg-[#2980B9] transition duration-300 ease-in-out transform hover:scale-105 font-medium text-lg"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Ajouter une prestation
                    </a>
                </div>

                {services.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-200">
                        <p className="text-xl text-gray-600 font-medium">
                            Aucune prestation trouvée.
                        </p>
                        <a
                            href="/provider/prestations/nouvelle"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#3498DB] text-white rounded-xl shadow-md hover:bg-[#2980B9] transition duration-300 ease-in-out transform hover:scale-105 font-medium"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Créer ma première prestation
                        </a>
                    </div>
                ) : (
                    // Liste des prestations
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col justify-between"
                            >
                                {/* Envelopper le contenu principal de la carte dans un Link */}
                                <Link
                                    to={`/provider/prestations/${service.id}`} // Route vers la page de détails
                                    className="block flex-grow" // Permet au Link de prendre l'espace disponible
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-[#2C3E50]">{service.type}</h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                                    statusColorMap[service.status] || "bg-gray-200 text-gray-800"
                                                }`}
                                            >
                                                {service.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                            {service.description || "Aucune description fournie."}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                            <p className="flex items-center gap-1">
                                                <Euro className="w-4 h-4 text-[#3498DB]" />
                                                <span className="font-semibold text-lg text-[#2C3E50]">
                                                    {parseFloat(service.price).toFixed(2)} €
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                Créé le {new Date(service.created_at).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Boutons d'action - En dehors du Link pour qu'ils soient cliquables indépendamment */}
                                <div className="flex justify-end gap-3 mt-4"> {/* Ajout de marge supérieure */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche le clic de se propager au Link parent
                                            navigate(`/provider/prestations/${service.id}/edit`);
                                        }}
                                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition duration-200"
                                    >
                                        <Edit className="w-4 h-4" /> Modifier
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche le clic de se propager au Link parent
                                            confirmDelete(service.id);
                                        }}
                                        className="inline-flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" /> Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
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
}
