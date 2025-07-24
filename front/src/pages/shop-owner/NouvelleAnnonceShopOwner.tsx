import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import API_URL from "@/config";
import AutocompleteInput from "@/components/AutoCompleteInput";

const NouvelleAnnonceShopOwner = () => {
    const [step, setStep] = useState(1);
    const [shops, setShops] = useState<{ id: number; name: string; address: string }[]>([]);
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [formData, setFormData] = useState({
        type: "",
        title: "",
        description: "",
        poids: "",
        longueur: "",
        largeur: "",
        hauteur: "",
        photo: null as File | null,
        destinataire_nom: "",
        destinataire_prenom: "",
        adresse: "",
        date: "",
        heure: "",
        prix: "",
        shop_id: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/shops/mine`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setShops(data));
    }, []);

    // Fonctions utilitaires pour la validation
    const isEmpty = (val: string) => !val || val.trim() === "" || val.trim().toLowerCase() === "nptk";
    const isNegative = (val: string) => parseFloat(val) < 0;

    // Fonction de validation par étape
    const validateStep = () => {
        if (step === 1) {
            if (isEmpty(formData.type)) {
                alert("Veuillez choisir un type de livraison.");
                return false;
            }
        }

        if (step === 2) {
            if (isEmpty(formData.title) || isEmpty(formData.description)) {
                alert("Titre et description obligatoires.");
                return false;
            }
            // Vérifier les champs numériques s'ils sont remplis et négatifs
            if (
                (formData.poids && isNegative(formData.poids)) ||
                (formData.longueur && isNegative(formData.longueur)) ||
                (formData.largeur && isNegative(formData.largeur)) || // <-- CORRECTION ICI : 'largeur' au lieu de 'lar geur'
                (formData.hauteur && isNegative(formData.hauteur))
            ) {
                alert("Aucune valeur (poids, dimensions) ne peut être négative.");
                return false;
            }
        }

        if (step === 3) {
            if (isEmpty(formData.shop_id) || isEmpty(formData.destinataire_nom) || isEmpty(formData.destinataire_prenom)) {
                alert("Champs destinataire et boutique obligatoires.");
                return false;
            }

            if (isEmpty(formData.adresse)) {
                alert("Adresse de livraison obligatoire.");
                return false;
            }

            if (isEmpty(formData.date) || isEmpty(formData.heure)) {
                alert("Date et heure de livraison obligatoires.");
                return false;
            }

            const now = new Date();
            const selectedDate = new Date(`${formData.date}T${formData.heure}`);
            if (selectedDate < now) {
                alert("La date/heure ne peut pas être antérieure à maintenant.");
                return false;
            }
        }

        return true; // Validation réussie pour l'étape actuelle
    };

    const next = async () => {
        // Appeler la validation avant de passer à l'étape suivante
        if (!validateStep()) {
            return; // Arrêter si la validation échoue
        }

        // Logique de calcul du prix estimé si on passe à l'étape 4 (ou si on est à l'étape 3 et on passe à 4)
        if (step === 3) { // Si on est à l'étape 3 et qu'on va passer à l'étape 4
            const selectedShop = shops.find((s) => s.id.toString() === formData.shop_id);
            if (selectedShop) {
                const getDistance = async (origin: string, destination: string): Promise<number> => {
                    try {
                        const res = await fetch(`${API_URL}/distance`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ origin, destination }),
                        });

                        const data = await res.json();
                        const distanceText = data?.rows?.[0]?.elements?.[0]?.distance?.text;

                        return distanceText
                            ? parseFloat(distanceText.replace(",", ".").replace(" km", ""))
                            : 0;
                    } catch (error) {
                        console.error("Erreur lors du calcul de distance :", error);
                        return 0;
                    }
                };

                const distance = await getDistance(selectedShop.address, formData.adresse);
                const estimated = (distance * 1.5).toFixed(2);
                setEstimatedPrice(estimated);
            }
        }

        if (step < 4) setStep(step + 1);
    };

    const back = () => step > 1 && setStep(step - 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFormData((prev) => ({ ...prev, photo: file }));
    };

    const submit = async () => {
        // Optionnel: Ajouter une validation finale pour l'étape 4 si nécessaire
        // if (!validateStep()) return;

        const data = new FormData();
        for (const key in formData) {
            const value = (formData as any)[key];
            // Ne pas append les valeurs nulles ou vides pour les fichiers par exemple,
            // ou si le backend attend des champs non vides
            if (value !== null && value !== undefined && value !== '') {
                // Pour les fichiers, append directement l'objet File
                if (key === 'photo' && value instanceof File) {
                    data.append(key, value);
                } else {
                    data.append(key, value.toString()); // Convertir en chaîne pour FormData
                }
            }
        }

        try {
            const res = await fetch(`${API_URL}/shopowner-requests/post`, {
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                navigate("/annonces/success"); // Assurez-vous que cette route existe
            } else {
                const errorData = await res.json();
                alert(`Erreur lors de la création de l’annonce: ${errorData.message || res.statusText}`);
            }
        } catch (err: any) {
            console.error("Erreur lors de la soumission de l'annonce :", err);
            alert(`Une erreur inattendue est survenue: ${err.message}`);
        }
    };

    const steps = [1, 2, 3, 4];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
                <div className="flex justify-center mb-8 gap-4">
                    {steps.map((s) => (
                        <div
                            key={s}
                            className={classNames(
                                "w-10 h-10 rounded-full flex items-center justify-center border text-sm font-semibold",
                                {
                                    "bg-[#1B4F3C] text-white border-[#1B4F3C]": step >= s,
                                    "text-gray-500 border-gray-300": step < s,
                                }
                            )}
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
                            <label className="block font-semibold">Type de livraison</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded px-4 py-2">
                                <option value="">Choisir...</option>
                                <option value="colis_total">Colis total</option>
                                <option value="livraison_domicile">Livraison domicile</option>
                                <option value="courses">Courses</option>
                            </select>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="block font-semibold">Titre</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <div className="flex gap-4">
                                <input name="poids" type="number" placeholder="Poids (kg)" value={formData.poids} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                                <input name="longueur" type="number" placeholder="Longueur (cm)" value={formData.longueur} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                            </div>
                            <div className="flex gap-4">
                                <input name="largeur" type="number" placeholder="Largeur (cm)" value={formData.largeur} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                                <input name="hauteur" type="number" placeholder="Hauteur (cm)" value={formData.hauteur} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                            </div>

                            <label className="block font-semibold">Photo</label>
                            <input type="file" accept="image/*" onChange={handleFile} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <label className="block font-semibold">Boutique d’envoi</label>
                            <select name="shop_id" value={formData.shop_id} onChange={handleChange} className="w-full border rounded px-4 py-2">
                                <option value="">Choisir...</option>
                                {shops.map((shop) => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name} - {shop.address}
                                    </option>
                                ))}
                            </select>

                            <label className="block font-semibold">Nom du destinataire</label>
                            <input name="destinataire_nom" value={formData.destinataire_nom} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Prénom du destinataire</label>
                            <input name="destinataire_prenom" value={formData.destinataire_prenom} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Adresse de livraison</label>
                            <AutocompleteInput name="adresse" value={formData.adresse} onChange={handleChange} />

                            <label className="block font-semibold">Date</label>
                            <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Heure</label>
                            <input name="heure" type="time" value={formData.heure} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 text-sm bg-gray-50 p-4 rounded border">
                            <p><strong>Type :</strong> {formData.type}</p>
                            <p><strong>Titre :</strong> {formData.title}</p>
                            <p><strong>Boutique :</strong> {shops.find((s) => s.id.toString() === formData.shop_id)?.name}</p>
                            <p><strong>Adresse livraison :</strong> {formData.adresse}</p>
                            <p><strong>Date :</strong> {formData.date} à {formData.heure}</p>

                            <label className="block font-semibold">Prix proposé (modifiable)</label>
                            <input
                                name="prix"
                                type="number"
                                step="0.01"
                                value={formData.prix}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />

                            <p><strong>Prix estimé :</strong> {estimatedPrice} €</p>
                        </div>
                    )}
                </motion.div>

                <div className="flex justify-between mt-8">
                    <button onClick={back} disabled={step === 1} className="px-4 py-2 rounded bg-gray-300 text-sm">
                        Retour
                    </button>

                    {step < 4 ? (
                        <button onClick={next} className="px-4 py-2 rounded bg-[#1B4F3C] text-white text-sm">
                            Suivant
                        </button>
                    ) : (
                        <button onClick={submit} className="px-4 py-2 rounded bg-[#1B4F3C] text-white text-sm">
                            Proposer cette livraison
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NouvelleAnnonceShopOwner;
