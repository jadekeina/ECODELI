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

    const next = async () => {
        if (step === 3) {
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
        const data = new FormData();
        for (const key in formData) {
            const value = (formData as any)[key];
            if (value) data.append(key, value);
        }

        try {
            const res = await fetch(`${API_URL}/shopowner-requests/post`, {
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) navigate("/annonces/success");
            else alert("Erreur lors de la création de l’annonce");
        } catch (err) {
            console.error(err);
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
                            <input name="title" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Description</label>
                            <textarea name="description" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <div className="flex gap-4">
                                <input name="poids" placeholder="Poids (kg)" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                                <input name="longueur" placeholder="Longueur (cm)" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                            </div>
                            <div className="flex gap-4">
                                <input name="largeur" placeholder="Largeur (cm)" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
                                <input name="hauteur" placeholder="Hauteur (cm)" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
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
                            <input name="destinataire_nom" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Prénom du destinataire</label>
                            <input name="destinataire_prenom" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Adresse de livraison</label>
                            <AutocompleteInput name="adresse" value={formData.adresse} onChange={handleChange} />

                            <label className="block font-semibold">Date</label>
                            <input name="date" type="date" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

                            <label className="block font-semibold">Heure</label>
                            <input name="heure" type="time" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
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
