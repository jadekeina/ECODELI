import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "@/config";

const RequestForm = () => {
    const { id: prestationId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: "",
        heure: "",
        lieu: "",
        commentaire: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const res = await fetch(`${API_URL}/requests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    prestation_id: prestationId,
                    ...formData,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("Votre demande a été envoyée avec succès.");
                setFormData({ date: "", heure: "", lieu: "", commentaire: "" });
                // navigate('/mon-compte') ou autre si besoin
            } else {
                setErrorMessage(data.message || "Une erreur est survenue.");
            }
        } catch (error) {
            console.error("Erreur envoi demande:", error);
            setErrorMessage("Erreur de connexion au serveur.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Faire une demande de réservation</h2>

            {successMessage && (
                <p className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Heure</label>
                    <input
                        type="time"
                        name="heure"
                        value={formData.heure}
                        onChange={handleChange}
                        required
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Lieu</label>
                    <input
                        type="text"
                        name="lieu"
                        value={formData.lieu}
                        onChange={handleChange}
                        required
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Commentaire (facultatif)</label>
                    <textarea
                        name="commentaire"
                        value={formData.commentaire}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#1B4F3C] text-white px-6 py-2 rounded hover:bg-[#164031] transition"
                >
                    Envoyer la demande
                </button>
            </form>
        </div>
    );
};

export default RequestForm;
