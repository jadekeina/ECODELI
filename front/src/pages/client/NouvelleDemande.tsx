import { useState, ChangeEvent, FormEvent, useContext } from "react"; // Supprimé useEffect et Prestation[] car plus de liste
import { useNavigate } from "react-router-dom";
import API_URL from "@/config";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import { PlusCircle, Calendar, Clock, MapPin, MessageCircle, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle, Package } from "lucide-react";
import AutocompleteInput from "@/components/AutoCompleteInput";

interface FormData {
    prestation_description: string; // CORRECTION ICI : Nouveau champ pour la description libre
    date: string;
    heure: string;
    lieu: string;
    commentaire: string;
}

const NouvelleDemande = () => {
    const { user } = useContext(UserContext) as { user: { id: number | string; role: string; token: string } | null };
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        prestation_description: "", // Initialisation
        date: "",
        heure: "",
        lieu: "",
        commentaire: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // HTMLSelectElement retiré
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleLieuAutocompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, lieu: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const validateForm = () => {
        // CORRECTION ICI : Validation pour prestation_description
        if (!formData.prestation_description.trim() || !formData.date || !formData.heure || !formData.lieu) {
            setError("Veuillez remplir tous les champs obligatoires (Prestation, Date, Heure, Lieu).");
            return false;
        }

        const selectedDateTime = new Date(`${formData.date}T${formData.heure}`);
        const now = new Date();
        if (selectedDateTime < now) {
            setError("La date et l'heure de la demande ne peuvent pas être dans le passé.");
            return false;
        }

        setError(null);
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user || user.role !== "client" || !user.token) {
            setError("Vous devez être connecté en tant que client pour créer une demande.");
            navigate("/login");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const payload = {
                prestation_description: formData.prestation_description.trim(), // CORRECTION ICI : envoi de la description libre
                date: formData.date,
                heure: formData.heure,
                lieu: formData.lieu,
                commentaire: formData.commentaire,
            };

            const res = await axios.post(`${API_URL}/service_requests`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (res.status === 201) {
                setSuccessMessage("Demande de prestation envoyée avec succès ! Redirection...");
                setFormData({
                    prestation_description: "",
                    date: "",
                    heure: "",
                    lieu: "",
                    commentaire: "",
                });
                setTimeout(() => {
                    navigate("/client/demandes");
                }, 2000);
            } else {
                setError(res.data?.message || "Erreur lors de l'envoi de la demande.");
            }
        } catch (err: any) {
            console.error("❌ Erreur lors de l'envoi de la demande :", err);
            setError(err.response?.data?.message || "Erreur serveur lors de l'envoi de la demande.");
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 text-center drop-shadow-sm flex items-center justify-center gap-3">
                    <PlusCircle className="w-10 h-10 text-[#2C3E50]" /> Nouvelle Demande
                </h1>

                {successMessage && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center shadow-md flex items-center gap-2 justify-center">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-medium text-lg">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center shadow-md flex items-center gap-2 justify-center">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Champ Prestation (maintenant un input texte libre) */}
                    <div>
                        <label htmlFor="prestation_description" className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" /> Type de Prestation
                        </label>
                        <input
                            id="prestation_description"
                            type="text"
                            name="prestation_description"
                            value={formData.prestation_description}
                            onChange={handleChange}
                            placeholder="Ex: Réparation de vélo, Cours de cuisine..."
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#2C3E50] focus:border-[#2C3E50] shadow-sm transition duration-150 text-gray-900"
                            required
                        />
                    </div>

                    {/* Champ Date */}
                    <div>
                        <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" /> Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#2C3E50] focus:border-[#2C3E50] shadow-sm transition duration-150 text-gray-900"
                            min={getMinDate()}
                            required
                        />
                    </div>

                    {/* Champ Heure */}
                    <div>
                        <label htmlFor="heure" className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" /> Heure
                        </label>
                        <input
                            id="heure"
                            type="time"
                            name="heure"
                            value={formData.heure}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#2C3E50] focus:border-[#2C3E50] shadow-sm transition duration-150 text-gray-900"
                            required
                        />
                    </div>

                    {/* Champ Lieu avec Autocomplétion */}
                    <div>
                        <AutocompleteInput
                            name="lieu"
                            label="Lieu"
                            value={formData.lieu}
                            onChange={handleLieuAutocompleteChange}
                            icon={<MapPin className="w-4 h-4 text-gray-500" />}
                        />
                    </div>

                    {/* Champ Commentaire (optionnel) */}
                    <div>
                        <label htmlFor="commentaire" className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-500" /> Commentaire (optionnel)
                        </label>
                        <textarea
                            id="commentaire"
                            name="commentaire"
                            value={formData.commentaire}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ajoutez des détails sur votre demande..."
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#2C3E50] focus:border-[#2C3E50] shadow-sm transition duration-150 text-gray-900 resize-y"
                        ></textarea>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/client/demandes")}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5" /> Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-105
                                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2C3E50] hover:bg-[#1A2C3E]"}`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? "Envoi..." : "Envoyer la demande"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NouvelleDemande;
