import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "@/config";
import { Edit, Euro, Calendar, Info, ArrowLeft, Tag, FileText } from "lucide-react";

const PrestationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mappage des statuts aux couleurs Tailwind CSS pour le badge
    const statusColorMap: { [key: string]: string } = {
        actif: "bg-green-100 text-green-800",
        inactif: "bg-gray-100 text-gray-600",
        en_attente: "bg-yellow-100 text-yellow-800",
        default: "bg-gray-200 text-gray-700",
    };

    useEffect(() => {
        const fetchService = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Token d'authentification manquant.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_URL}/services/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok && data.service) {
                    setService(data.service);
                } else {
                    setError(data.message || "Prestation introuvable.");
                }
            } catch (err) {
                console.error("Erreur lors du chargement de la prestation :", err);
                setError("Erreur lors du chargement de la prestation.");
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-base text-gray-600">Chargement des détails de la prestation...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-base text-red-500 font-medium">{error}</p>
            </div>
        );
    }
    if (!service) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-base text-gray-600">Aucune prestation trouvée pour cet ID.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6 font-inter">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-[#2C3E50] drop-shadow-sm flex items-center gap-2">
                        <Info className="w-7 h-7 text-[#2C3E50]" /> Détails de la Prestation
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition duration-200 font-medium text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                </div>

                <div className="space-y-4 text-gray-700 text-base">
                    {/* Type de prestation */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Tag className="w-5 h-5 text-emerald-600" />
                        <p>
                            <strong className="font-semibold text-[#2C3E50]">Type :</strong> {service.type}
                            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                statusColorMap[service.status] || statusColorMap.default
                            }`}>
                                {service.status.replace('_', ' ')}
                            </span>
                        </p>
                    </div>

                    {/* Description */}
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <p className="flex items-center gap-2 mb-1.5">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            <strong className="font-semibold text-[#2C3E50]">Description :</strong>
                        </p>
                        <p className="ml-7 text-gray-800 leading-normal text-sm">
                            {service.description || "Aucune description fournie pour cette prestation."}
                        </p>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Euro className="w-5 h-5 text-emerald-600" />
                        <p>
                            <strong className="font-semibold text-[#2C3E50]">Prix :</strong>{" "}
                            <span className="text-lg font-bold text-green-700">
                                {parseFloat(service.price).toFixed(2)} €
                            </span>
                        </p>
                    </div>

                    {/* Date de création */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <p>
                            <strong className="font-semibold text-[#2C3E50]">Créé le :</strong>{" "}
                            {new Date(service.created_at).toLocaleDateString("fr-FR")}
                        </p>
                    </div>
                </div>

                {/* Bouton Modifier */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(`/provider/prestations/${service.id}/edit`)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3498DB] text-white rounded-xl shadow-md hover:bg-[#2980B9] transition duration-300 ease-in-out transform hover:scale-105 font-bold text-lg"
                    >
                        <Edit className="w-6 h-6" /> Modifier la Prestation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrestationDetails;
