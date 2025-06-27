import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const typeLabels: Record<string, string> = {
    colis_total: "Envoi d’un colis (total)",
    colis_partiel: "Envoi d’un colis (partiel)",
    livraison_domicile: "Livraison à domicile",
    transport_personne: "Transport de personnes",
    courses: "Courses / achats",
    achat_etranger: "Achat à l’étranger",
    service_domicile: "Service à domicile",
    box_stockage: "Box de stockage temporaire"
};

const typeChamps: Record<string, string[]> = {
    colis_total: ["titre", "adresse_depart", "adresse_arrivee", "date_demande", "longueur", "largeur", "poids", "photo", "prix"],
    colis_partiel: ["titre", "adresse_depart", "adresse_arrivee", "date_demande", "longueur", "largeur", "poids", "photo", "prix"],
    livraison_domicile: ["titre", "adresse_arrivee", "date_demande", "longueur", "largeur", "poids", "photo", "prix"],
    transport_personne: ["titre", "adresse_depart", "adresse_arrivee", "date_demande", "prix", "heure_depart", "heure_arrivee"],
    courses: ["titre", "adresse_arrivee", "date_demande", "budget", "tarif_prestataire"],
    achat_etranger: ["titre", "adresse_arrivee", "date_demande", "budget"],
    service_domicile: ["titre", "adresse_arrivee", "date_demande", "type_service", "prix"],
    box_stockage: ["titre", "adresse_depart", "date_demande", "duree", "surface"]
};

export default function CreateAnnonce() {
    const [typeAnnonce, setTypeAnnonce] = useState<string>("");
    const [formData, setFormData] = useState<any>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!typeAnnonce) return alert("Veuillez sélectionner un type d’annonce.");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/annonces`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: typeAnnonce,
                    ...formData
                })
            });

            if (!res.ok) throw new Error("Erreur lors de la création de l’annonce");
            setSuccessMessage("Annonce créée avec succès ✨");
        } catch (err) {
            console.error(err);
            setSuccessMessage("Erreur lors de la création de l’annonce ❌");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Créer une annonce</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(typeLabels).map(([key, label]) => (
                    <Button
                        key={key}
                        variant={typeAnnonce === key ? "default" : "outline"}
                        onClick={() => setTypeAnnonce(key)}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            {typeAnnonce && (
                <div className="space-y-4">
                    {typeChamps[typeAnnonce].includes("titre") && (
                        <div>
                            <Label>Titre de l’annonce</Label>
                            <Input name="titre" value={formData.titre || ""} onChange={handleChange} />
                        </div>
                    )}

                    {typeChamps[typeAnnonce].includes("adresse_depart") && (
                        <div>
                            <Label>Adresse de départ</Label>
                            <Input name="adresse_depart" value={formData.adresse_depart || ""} onChange={handleChange} />
                        </div>
                    )}

                    {typeChamps[typeAnnonce].includes("adresse_arrivee") && (
                        <div>
                            <Label>Adresse d’arrivée</Label>
                            <Input name="adresse_arrivee" value={formData.adresse_arrivee || ""} onChange={handleChange} />
                        </div>
                    )}

                    {typeChamps[typeAnnonce].includes("date_demande") && (
                        <div>
                            <Label>Date souhaitée</Label>
                            <Input type="date" name="date_demande" value={formData.date_demande || ""} onChange={handleChange} />
                        </div>
                    )}

                    {typeChamps[typeAnnonce].includes("longueur") && (
                        <div>
                            <Label>Longueur (cm)</Label>
                            <Input type="number" name="longueur" value={formData.longueur || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("largeur") && (
                        <div>
                            <Label>Largeur (cm)</Label>
                            <Input type="number" name="largeur" value={formData.largeur || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("poids") && (
                        <div>
                            <Label>Poids (kg)</Label>
                            <Input type="number" name="poids" value={formData.poids || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("prix") && (
                        <div>
                            <Label>Prix (€)</Label>
                            <Input type="number" name="prix" value={formData.prix || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("photo") && (
                        <div>
                            <Label>Photo</Label>
                            <Input type="text" name="photo" value={formData.photo || ""} onChange={handleChange} placeholder="URL ou nom de fichier" />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("heure_depart") && (
                        <div>
                            <Label>Heure de départ</Label>
                            <Input type="time" name="heure_depart" value={formData.heure_depart || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("heure_arrivee") && (
                        <div>
                            <Label>Heure d’arrivée</Label>
                            <Input type="time" name="heure_arrivee" value={formData.heure_arrivee || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("budget") && (
                        <div>
                            <Label>Budget (€)</Label>
                            <Input type="number" name="budget" value={formData.budget || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("tarif_prestataire") && (
                        <div>
                            <Label>Tarif prestataire (€)</Label>
                            <Input type="number" name="tarif_prestataire" value={formData.tarif_prestataire || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("type_service") && (
                        <div>
                            <Label>Type de service</Label>
                            <Input name="type_service" value={formData.type_service || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("duree") && (
                        <div>
                            <Label>Durée souhaitée (jours)</Label>
                            <Input type="number" name="duree" value={formData.duree || ""} onChange={handleChange} />
                        </div>
                    )}
                    {typeChamps[typeAnnonce].includes("surface") && (
                        <div>
                            <Label>Surface (m²)</Label>
                            <Input type="number" name="surface" value={formData.surface || ""} onChange={handleChange} />
                        </div>
                    )}

                    <div>
                        <Label>Description</Label>
                        <Textarea name="description" value={formData.description || ""} onChange={handleChange} />
                    </div>

                    {successMessage && (
                        <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded">
                            {successMessage}
                        </div>
                    )}

                    <Button className="mt-4 w-full" onClick={handleSubmit}>
                        Créer l’annonce
                    </Button>
                </div>
            )}
        </div>
    );
}
