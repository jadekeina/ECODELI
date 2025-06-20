import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ChauffeurIcon from "@/assets/image/livreur-removebg-preview.svg";
import PrestataireIcon from "@/assets/image/utilisateur-removebg-preview.svg";
import BoutiqueIcon from "@/assets/image/boutique-removebg-preview_1.svg";

const AutocompleteInput = ({ name, label, value, onChange }: any) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        onChange(e);

        if (!inputVal) return setSuggestions([]);

        try {
            const res = await fetch(
                `https://places.googleapis.com/v1/places:autocomplete?key=${import.meta.env.VITE_Maps_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        input: inputVal,
                        languageCode: "fr",
                        regionCode: "FR",
                    }),
                }
            );

            const data = await res.json();
            const results = data?.suggestions?.map((s: any) => s?.placePrediction?.text?.text) || [];
            setSuggestions(results);
        } catch (err) {
            console.error("Erreur API Suggestions:", err);
        }
    };

    const handleSelect = (suggestion: string) => {
        onChange({ target: { name, value: suggestion } });
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <Label className="text-lg">{label}</Label>
            <Input
                name={name}
                value={value}
                onChange={handleInput}
                className="h-12 text-base"
                autoComplete="off"
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
                    {suggestions.map((s, idx) => (
                        <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(s)}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const roles = [
    { id: "delivery-driver", label: "Chauffeur", icon: ChauffeurIcon },
    { id: "provider", label: "Prestataire", icon: PrestataireIcon },
    { id: "shop-owner", label: "Commerçant", icon: BoutiqueIcon },
];

export default function RegisterPro() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        zone: "",
        siret: "",
        nom_entreprise: "",
        adresse: "",
        type: "",
    });
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [errors, setErrors] = useState<{ siret?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "siret") {
            const isValid = /^[0-9]{14}$/.test(value);
            setErrors({ ...errors, siret: isValid ? undefined : "Le numéro SIRET doit contenir exactement 14 chiffres." });
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setFiles({ ...files, [name]: e.target.files?.[0] || null });
    };

    const handleSubmit = () => {
        console.log("Données :", formData);
        console.log("Fichiers :", files);
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 h-screen">
                <img
                    src="/nous-rejoindre-ecodeli.webp"
                    alt="Illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-1/2 p-16 flex flex-col justify-center space-y-10 relative z-0">
                {step === 1 && (
                    <div>
                        <h2 className="text-4xl font-bold mb-8">Choisissez votre statut professionnel</h2>
                        <div className="grid grid-cols-3 gap-8 px-24 py-10 justify-center">
                            {roles.map((r) => (
                                <Button
                                    key={r.id}
                                    variant={role === r.id ? "default" : "outline"}
                                    onClick={() => setRole(r.id)}
                                    className="flex flex-col items-center justify-center gap-3 px-8 py-10 h-40 w-full text-lg"
                                >
                                    <img src={r.icon} alt={r.label} className="w-14 h-14" />
                                    <span className="font-medium">{r.label}</span>
                                </Button>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button className="h-12 text-base px-6" disabled={!role} onClick={() => setStep(2)}>
                                Suivant
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold mb-4">Informations professionnelles</h2>
                        {role === "delivery-driver" && (
                            <AutocompleteInput
                                name="zone"
                                label="Zone de déplacement"
                                value={formData.zone}
                                onChange={handleChange}
                            />
                        )}
                        {role === "provider" && (
                            <div className="space-y-4">
                                <Label className="text-lg">Type de prestation</Label>
                                <Input className="h-12 text-base" name="type" value={formData.type} onChange={handleChange} />
                                <AutocompleteInput
                                    name="zone"
                                    label="Zone de déplacement"
                                    value={formData.zone}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {role === "shop-owner" && (
                            <div className="space-y-4">
                                <Label className="text-lg">Nom de l'entreprise</Label>
                                <Input className="h-12 text-base" name="nom_entreprise" value={formData.nom_entreprise} onChange={handleChange} />
                                <Label className="text-lg">SIRET</Label>
                                <Input className="h-12 text-base" name="siret" value={formData.siret} onChange={handleChange} />
                                {errors.siret && <p className="text-sm text-red-500 mt-1">{errors.siret}</p>}
                                <AutocompleteInput
                                    name="adresse"
                                    label="Adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
                            <Button className="h-12 text-base px-6" onClick={() => setStep(3)}>Suivant</Button>
                        </div>
                    </div>
                )}

                {step === 3 && role !== "shop-owner" && (
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold mb-4">Téléversement des documents</h2>
                        {role === "delivery-driver" && (
                            <div className="space-y-4">
                                {["Permis de conduire", "Pièce d'identité", "Avis SIRENE", "Attestation URSSAF", "RC Pro"].map((label, i) => (
                                    <div key={i}>
                                        <Label className="text-lg">{label}</Label>
                                        <Input className="h-12 text-base" type="file" onChange={(e) => handleFile(e, label)} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {role === "provider" && (
                            <div>
                                <Label className="text-lg">Diplôme</Label>
                                <Input className="h-12 text-base" type="file" onChange={(e) => handleFile(e, "diplome")} />
                            </div>
                        )}
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)}>Retour</Button>
                            <Button className="h-12 text-base px-6" onClick={handleSubmit}>Valider</Button>
                        </div>
                    </div>
                )}

                {step === 3 && role === "shop-owner" && (
                    <div className="space-y-6">
                        <div className="text-lg text-gray-600">Aucun document requis. Cliquez sur <strong>Valider</strong> pour finaliser.</div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)}>Retour</Button>
                            <Button className="h-12 text-base px-6" onClick={handleSubmit}>Valider</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}