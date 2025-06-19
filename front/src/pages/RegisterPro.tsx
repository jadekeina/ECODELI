import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roles = [
    { id: "delivery-driver", label: "Chauffeur", emoji: "🛻" },
    { id: "provider", label: "Prestataire", emoji: "💆" },
    { id: "shop-owner", label: "Commerçant", emoji: "🏪" }
];

export default function RegisterPro() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        // Champs supplémentaires selon le rôle
        zone: "",
        siret: "",
        nom_entreprise: "",
        diplome: "",
        type: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Soumission :", formData, role);
        // TODO : POST vers l'endpoint correspondant selon le rôle
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


            <div className="w-1/2 p-10 flex flex-col justify-center space-y-6">
                {step === 1 && (
                    <div>
                        <h2 className="text-4xl font-bold mb-10">Choisissez votre statut professionnel</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {roles.map((r) => (
                                <Button
                                    key={r.id}
                                    variant={role === r.id ? "default" : "outline"}
                                    onClick={() => setRole(r.id)}
                                >
                                    {r.emoji} {r.label}
                                </Button>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button disabled={!role} onClick={() => setStep(2)}>
                                Suivant
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold mb-4">Informations personnelles</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-lg">Nom</Label>
                                <Input name="nom" value={formData.nom} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-lg">Prénom</Label>
                                <Input name="prenom" value={formData.prenom} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-lg">Email</Label>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className="text-lg">Mot de passe</Label>
                                <Input name="password" type="password" value={formData.password} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
                            <Button onClick={() => setStep(3)}>Suivant</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Détails professionnels</h2>
                        {role === "delivery-driver" && (
                            <div>
                                <Label className="text-lg">Zone de déplacement</Label>
                                <Input name="zone" value={formData.zone} onChange={handleChange} />
                            </div>
                        )}
                        {role === "provider" && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-lg">Type de prestation</Label>
                                    <Input name="type" value={formData.type} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label className="text-lg">Diplôme</Label>
                                    <Input name="diplome" value={formData.diplome} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label className="text-lg">Zone de déplacement</Label>
                                    <Input name="zone" value={formData.zone} onChange={handleChange} />
                                </div>
                            </div>
                        )}
                        {role === "shop-owner" && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-lg">Nom de l'entreprise</Label>
                                    <Input name="nom_entreprise" value={formData.nom_entreprise} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label className="text-lg">SIRET</Label>
                                    <Input name="siret" value={formData.siret} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)}>Retour</Button>
                            <Button onClick={handleSubmit}>Valider</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
