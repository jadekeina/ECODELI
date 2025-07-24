// front/src/pages/shop-owner/AjouterBoutique.tsx
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "@/config";
import AutocompleteInput from "@/components/AutoCompleteInput";
import axios from "axios";
import { PlusCircle, Store, MapPin, Save, ArrowLeft, Loader2, AlertCircle } from "lucide-react"; // eslint-disable-line @typescript-eslint/no-unused-vars

const AjouterBoutique = () => {
    console.log("AjouterBoutique component rendering...");

    const [formData, setFormData] = useState({
        name: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleAutocompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, address: value }));
        setError(null);
        setSuccessMessage(null);
    };


    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token d'authentification manquant. Veuillez vous reconnecter.");
            setLoading(false);
            return;
        }

        try {
            // CORRECTION ICI : Changement de l'URL de `shops/post` à `shops`
            const res = await axios.post(`${API_URL}/shops`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 201) {
                setSuccessMessage("Boutique enregistrée avec succès ! Redirection...");
                setTimeout(() => {
                    navigate("/mes-boutiques");
                }, 1500);
            } else {
                setError(res.data?.message || "Erreur lors de l’enregistrement de la boutique.");
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Erreur lors de l'enregistrement :", err);
            setError(err.response?.data?.message || "Erreur serveur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8 font-inter">
            <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-[#1B4F3C] mb-8 text-center drop-shadow-sm flex items-center justify-center gap-3">
                    <PlusCircle className="w-10 h-10 text-[#1B4F3C]" /> Ajouter une boutique
                </h1>

                {successMessage && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center shadow-md">
                        <p className="font-medium text-lg">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center shadow-md flex items-center gap-2 justify-center">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                            <Store className="inline-block w-4 h-4 mr-2 text-gray-500" /> Nom de la boutique
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nom de la boutique"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-[#1B4F3C] focus:border-[#1B4F3C] shadow-sm transition duration-150"
                        />
                    </div>

                    <div>
                        <AutocompleteInput
                            name="address"
                            value={formData.address}
                            onChange={handleAutocompleteChange}
                            label="Adresse de la boutique"
                            icon={<MapPin className="inline-block w-4 h-4 mr-2 text-gray-500" />}
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={() => navigate("/mes-boutiques")}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-md hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5" /> Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-105
                                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1B4F3C] hover:bg-[#142D2D]"}`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AjouterBoutique;
