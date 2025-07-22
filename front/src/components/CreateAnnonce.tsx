import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AutocompleteInput from "@/components/AutoCompleteInput.tsx";
import { useTranslation } from "react-i18next";

export default function CreateAnnonce() {
  const { t } = useTranslation();

  // Place ici, dans le composant, pour que t() fonctionne dynamiquement
  const typeLabels: Record<string, string> = {
    colis_total: t("createAd.colis_total"),
    colis_partiel: t("createAd.colis_partiel"),
    livraison_domicile: t("createAd.livraison_domicile"),
    transport_personne: t("createAd.transport_personne"),
    courses: t("createAd.courses"),
    achat_etranger: t("createAd.achat_etranger"),
    service_domicile: t("createAd.service_domicile"),
    box_stockage: t("createAd.box_stockage"),
  };

  const typeChamps: Record<string, string[]> = {
    colis_total: [
      "adresse_depart",
      "adresse_arrivee",
      "date_demande",
      "longueur",
      "largeur",
      "poids",
      "prix",
    ],
    colis_partiel: [
      "adresse_depart",
      "adresse_arrivee",
      "date_demande",
      "longueur",
      "largeur",
      "poids",
      "prix",
    ],
    livraison_domicile: [
      "adresse_depart",
      "adresse_arrivee",
      "date_demande",
      "longueur",
      "largeur",
      "poids",
      "prix",
    ],
    transport_personne: [
      "adresse_depart",
      "adresse_arrivee",
      "date_demande",
      "heure_depart",
      "heure_arrivee",
      "prix",
    ],
    courses: ["adresse_arrivee", "date_demande", "budget", "tarif_prestataire"],
    achat_etranger: [
      "adresse_arrivee",
      "date_demande",
      "budget",
      "tarif_prestataire",
    ],
    service_domicile: ["adresse_arrivee", "date_demande", "tarif_prestataire"],
    box_stockage: ["adresse_depart", "date_demande", "taille_box", "duree"],
  };

  const calculerPrixViaDistance = async (
    origin: string,
    destination: string,
  ): Promise<number | null> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/distance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      });

      const data = await res.json();
      const distanceText = data?.rows?.[0]?.elements?.[0]?.distance?.text;

      const distanceKm = distanceText
        ? parseFloat(distanceText.replace(",", ".").replace(" km", ""))
        : null;

      if (!distanceKm) return null;

      const tarifParKm = 0.8;
      return parseFloat((distanceKm * tarifParKm).toFixed(2));
    } catch (err) {
      console.error("Erreur lors du calcul de distance:", err);
      return null;
    }
  };

  const [typeAnnonce, setTypeAnnonce] = useState<string>("");
  const [formData, setFormData] = useState<any>({
    titre: "",
    adresse_depart: "",
    adresse_arrivee: "",
    date_demande: "",
    description: "",
    longueur: "",
    largeur: "",
    poids: "",
    heure_depart: "",
    heure_arrivee: "",
    prix: "",
    prix_suggere: "",
    budget: "",
    tarif_prestataire: "",
    taille_box: "",
    duree: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const updatePrixSuggere = async () => {
      const needPrice = [
        "colis_total",
        "colis_partiel",
        "livraison_domicile",
        "transport_personne",
      ].includes(typeAnnonce);

      if (needPrice && formData.adresse_depart && formData.adresse_arrivee) {
        const prix = await calculerPrixViaDistance(
          formData.adresse_depart,
          formData.adresse_arrivee,
        );
        if (prix !== null) {
          setFormData((prev: typeof formData) => ({ ...prev, prix_suggere: prix.toString() }));
        }
      }
    };

    updatePrixSuggere();
  }, [formData.adresse_depart, formData.adresse_arrivee, typeAnnonce]);

  const handleSubmit = async () => {
    if (!typeAnnonce || !formData.titre)
      return alert(t("createAd.fill_required"));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/annonces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: typeAnnonce,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création de l’annonce");
      setSuccessMessage(t("createAd.success"));
    } catch (err) {
      console.error(err);
      setSuccessMessage(t("createAd.error"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t("createAd.title")}</h1>

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
          <div>
            <Label>{t("createAd.titre")}</Label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
            />
          </div>

          {typeChamps[typeAnnonce].includes("adresse_depart") && (
            <AutocompleteInput
              name="adresse_depart"
              label={t("createAd.adresse_depart")}
              value={formData.adresse_depart}
              onChange={handleChange}
            />
          )}

          {typeChamps[typeAnnonce].includes("adresse_arrivee") && (
            <AutocompleteInput
              name="adresse_arrivee"
              label={t("createAd.adresse_arrivee")}
              value={formData.adresse_arrivee}
              onChange={handleChange}
            />
          )}

          {typeChamps[typeAnnonce].includes("date_demande") && (
            <div>
              <Label>{t("createAd.date_demande")}</Label>
              <Input
                type="date"
                name="date_demande"
                value={formData.date_demande}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("longueur") && (
            <div>
              <Label>{t("createAd.longueur")}</Label>
              <Input
                name="longueur"
                value={formData.longueur}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("largeur") && (
            <div>
              <Label>{t("createAd.largeur")}</Label>
              <Input
                name="largeur"
                value={formData.largeur}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("poids") && (
            <div>
              <Label>{t("createAd.poids")}</Label>
              <Input
                name="poids"
                value={formData.poids}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("heure_depart") && (
            <div>
              <Label>{t("createAd.heure_depart")}</Label>
              <Input
                type="time"
                name="heure_depart"
                value={formData.heure_depart}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("heure_arrivee") && (
            <div>
              <Label>{t("createAd.heure_arrivee")}</Label>
              <Input
                type="time"
                name="heure_arrivee"
                value={formData.heure_arrivee}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("prix") && (
            <div>
              <Label>{t("createAd.prix")}</Label>
              <Input
                name="prix"
                type="number"
                placeholder={t("createAd.prix_placeholder")}
                value={formData.prix}
                onChange={handleChange}
              />
              {formData.prix_suggere && (
                <p className="text-green-600 text-sm mt-1">
                  {t("createAd.prix_suggere")}: {formData.prix_suggere} €
                </p>
              )}
            </div>
          )}

          {typeChamps[typeAnnonce].includes("budget") && (
            <div>
              <Label>{t("createAd.budget")}</Label>
              <Input
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("tarif_prestataire") && (
            <div>
              <Label>{t("createAd.tarif_prestataire")}</Label>
              <Input
                name="tarif_prestataire"
                value={formData.tarif_prestataire}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("taille_box") && (
            <div>
              <Label>{t("createAd.taille_box")}</Label>
              <Input
                name="taille_box"
                value={formData.taille_box}
                onChange={handleChange}
              />
            </div>
          )}

          {typeChamps[typeAnnonce].includes("duree") && (
            <div>
              <Label>{t("createAd.duree")}</Label>
              <Input
                name="duree"
                value={formData.duree}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <Label>{t("createAd.description")}</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {successMessage && (
            <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded">
              {successMessage}
            </div>
          )}

          <Button className="mt-4 w-full" onClick={handleSubmit}>
            {t("createAd.create")}
          </Button>
        </div>
      )}
    </div>
  );
}
