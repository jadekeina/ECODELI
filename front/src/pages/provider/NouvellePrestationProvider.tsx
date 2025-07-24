import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API_URL from "@/config";

const NouvellePrestationProvider = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: "",
        customType: "",
        description: "",
        price: "",
        status: "actif",
    });

    const isEmpty = (val: string) => !val || val.trim() === "";
    const isNegative = (val: string) => parseFloat(val) < 0;
    const hasInvalidChars = (val: string) => /[\d]/.test(val); // interdit les chiffres

    const validateStep = () => {
        if (step === 1) {
            if (isEmpty(formData.type)) {
                setErrorMessage("Veuillez choisir un type de prestation.");
                return false;
            }
            if (formData.type === "autre" && (isEmpty(formData.customType) || hasInvalidChars(formData.customType))) {
                setErrorMessage("Veuillez entrer un nom de prestation valide (sans chiffres).");
                return false;
            }
            if (isEmpty(formData.description)) {
                setErrorMessage("Veuillez entrer une description.");
                return false;
            }
        }
        if (step === 2) {
            if (isEmpty(formData.price)) {
                setErrorMessage("Veuillez indiquer un prix.");
                return false;
            }
            if (isNegative(formData.price)) {
                setErrorMessage("Le prix ne peut pas être négatif.");
                return false;
            }
            if (isEmpty(formData.status)) {
                setErrorMessage("Veuillez sélectionner un statut.");
                return false;
            }
        }
        setErrorMessage(null);
        return true;
    };

    const next = () => {
        if (!validateStep()) return;
        if (step < 3) setStep(step + 1);
    };

    const back = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const submit = async () => {
        const payload = {
            type: formData.type === "autre" ? formData.customType : formData.type,
            description: formData.description,
            price: formData.price,
            status: formData.status,
        };

        try {
            const res = await fetch(`${API_URL}/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                navigate("/provider/prestations");
            } else {
                const errorData = await res.json();
                setErrorMessage(errorData.message || "Erreur lors de la création de la prestation");
            }
        } catch (err: any) {
            console.error("Erreur lors de la création:", err);
            setErrorMessage("Erreur inattendue : " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Ajouter une nouvelle prestation</h1>

            {errorMessage && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errorMessage}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
                <div className="flex justify-center mb-8 gap-4">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-semibold ${
                                step >= s
                                    ? "bg-[#1B4F3C] text-white border-[#1B4F3C]"
                                    : "text-gray-500 border-gray-300"
                            }`}
                        >
                            {s}
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="block font-semibold">Type de prestation</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full border rounded px-4 py-2"
                            >
                                <option value="">Choisir...</option>
                                <option value="Massage">Massage</option>
                                <option value="Coach Sportif">Coach Sportif</option>
                                <option value="Ménage">Ménage</option>
                                <option value="Baby-sitter">Baby-sitter</option>
                                <option value="Esthéticienne">Esthéticienne</option>
                                <option value="autre">Autre</option>
                            </select>
                            {formData.type === "autre" && (
                                <input
                                    name="customType"
                                    placeholder="Nom de la prestation"
                                    value={formData.customType}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-2 rounded"
                                />
                            )}

                            <label className="block font-semibold">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="block font-semibold">Prix (en €)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />

                            <label className="block font-semibold">Statut</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded px-4 py-2"
                            >
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                            </select>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 text-sm bg-gray-50 p-4 rounded border">
                            <p><strong>Type :</strong> {formData.type === "autre" ? formData.customType : formData.type}</p>
                            <p><strong>Description :</strong> {formData.description}</p>
                            <p><strong>Prix :</strong> {formData.price} €</p>
                            <p><strong>Statut :</strong> {formData.status}</p>
                        </div>
                    )}
                </motion.div>

                <div className="flex justify-between mt-8">
                    <button onClick={back} disabled={step === 1} className="px-4 py-2 rounded bg-gray-300 text-sm">
                        Retour
                    </button>

                    {step < 3 ? (
                        <button onClick={next} className="px-4 py-2 rounded bg-[#1B4F3C] text-white text-sm">
                            Suivant
                        </button>
                    ) : (
                        <button onClick={submit} className="px-4 py-2 rounded bg-[#1B4F3C] text-white text-sm">
                            Créer la prestation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NouvellePrestationProvider;
