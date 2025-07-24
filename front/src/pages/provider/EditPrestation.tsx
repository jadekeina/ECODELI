import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "@/config";
import { Edit, Save, ArrowLeft, Info } from "lucide-react"; // Importation d'icônes

interface Service {
    id: number;
    type: string;
    description: string;
    price: string;
    status: string;
    created_at: string;
}

const EditPrestation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        type: "",
        customType: "", // Pour le type "Autre"
        description: "",
        price: "",
        status: "actif",
    });

    // Mappage des statuts aux couleurs Tailwind CSS pour l'aperçu
    const statusColorMap: { [key: string]: string } = {
        actif: "bg-green-100 text-green-800",
        inactif: "bg-gray-100 text-gray-600",
        en_attente: "bg-yellow-100 text-yellow-800", // Si un service peut être en attente
    };

    const fetchService = async () => {
        console.log("🔍 Chargement du service ID:", id);
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
                const service = data.service;
                console.log("🎯 Données reçues :", service);

                // Définir les options de type prédéfinies
                const predefinedTypes = ["Massage", "Coach Sportif", "Ménage", "Baby-sitter", "Esthéticienne"];
                const isPredefined = predefinedTypes.includes(service.type);

                setFormData({
                    type: isPredefined ? service.type : "autre",
                    customType: isPredefined ? "" : service.type, // Si c'est "autre", stocker le type réel ici
                    description: service.description,
                    price: service.price,
                    status: service.status,
                });
            } else {
                setError(data.message || "Impossible de charger la prestation.");
            }
        } catch (err) {
            console.error("Erreur fetch:", err);
            setError("Erreur lors du chargement de la prestation.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchService();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            type: formData.type === "autre" ? formData.customType : formData.type,
            description: formData.description,
            price: formData.price,
            status: formData.status,
        };

        // Validation simple côté client
        if (!payload.type || !payload.description || !payload.price) {
            alert("Veuillez remplir tous les champs obligatoires (Type, Description, Prix).");
            return;
        }
        if (isNaN(parseFloat(payload.price)) || parseFloat(payload.price) <= 0) {
            alert("Le prix doit être un nombre positif.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/services/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Prestation mise à jour avec succès !");
                navigate("/provider/prestations"); // Rediriger vers la liste des prestations
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Erreur lors de la mise à jour de la prestation.");
            }
        } catch (err: any) {
            console.error("Erreur inattendue lors de la soumission:", err);
            alert("Erreur inattendue : " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-gray-600">Chargement de la prestation...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    // Déterminer le type affiché dans l'aperçu
    const displayedType = formData.type === 'autre' && formData.customType ? formData.customType : formData.type;


    return (
        <div className="min-h-screen bg-white p-8 font-inter"> {/* Fond blanc */}
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#2C3E50] drop-shadow-sm flex items-center gap-3">
                        <Edit className="w-9 h-9 text-[#2C3E50]" /> Modifier la Prestation
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition duration-200 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </button>
                </div>

                {/* Résumé de la prestation actuelle - Amélioré */}
                <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-base text-blue-800 flex items-start gap-4 shadow-sm">
                    <Info className="w-6 h-6 text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-lg text-blue-900 mb-2">Prestation actuelle :</h3>
                        <p className="mb-1">
                            <strong className="text-blue-700">Type :</strong> {displayedType || "Non renseigné"}
                            <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                statusColorMap[formData.status] || "bg-gray-200 text-gray-700"
                            }`}>
                                {formData.status.replace('_', ' ')}
                            </span>
                        </p>
                        <p className="mb-1">
                            <strong className="text-blue-700">Description :</strong> {formData.description || "Non renseignée"}
                        </p>
                        <p className="mb-1">
                            <strong className="text-blue-700">Prix :</strong> {parseFloat(formData.price).toFixed(2)} €
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6"> {/* Espacement augmenté */}
                    {/* Champ Type */}
                    <div>
                        <label htmlFor="type" className="block text-gray-700 text-lg font-semibold mb-2">Type de prestation</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                        >
                            <option value="">Sélectionner un type...</option>
                            <option value="Massage">Massage</option>
                            <option value="Coach Sportif">Coach Sportif</option>
                            <option value="Ménage">Ménage</option>
                            <option value="Baby-sitter">Baby-sitter</option>
                            <option value="Esthéticienne">Esthéticienne</option>
                            <option value="autre">Autre (préciser)</option>
                        </select>
                    </div>

                    {/* Champ Type personnalisé (si "Autre" est sélectionné) */}
                    {formData.type === "autre" && (
                        <div>
                            <label htmlFor="customType" className="block text-gray-700 text-lg font-semibold mb-2">Type personnalisé</label>
                            <input
                                id="customType"
                                name="customType"
                                type="text"
                                value={formData.customType}
                                onChange={handleChange}
                                placeholder="Ex: Cours de cuisine, Gardiennage d'animaux..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                            />
                        </div>
                    )}

                    {/* Champ Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-2">Description détaillée</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4} // Hauteur augmentée
                            placeholder="Décrivez votre prestation en détail..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition duration-200 ease-in-out shadow-sm resize-y" // Resize vertical
                        />
                    </div>

                    {/* Champ Prix */}
                    <div>
                        <label htmlFor="price" className="block text-gray-700 text-lg font-semibold mb-2">Prix (€)</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01" // Permet les décimales
                            placeholder="Ex: 25.00"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                        />
                    </div>

                    {/* Champ Statut */}
                    <div>
                        <label htmlFor="status" className="block text-gray-700 text-lg font-semibold mb-2">Statut de la prestation</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                        >
                            <option value="actif">Actif (Visible par les clients)</option>
                            <option value="inactif">Inactif (Non visible)</option>
                        </select>
                    </div>

                    {/* Bouton Enregistrer */}
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3498DB] text-white rounded-xl shadow-md hover:bg-[#2980B9] transition duration-300 ease-in-out transform hover:scale-105 font-bold text-lg"
                    >
                        <Save className="w-6 h-6" /> Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPrestation;
