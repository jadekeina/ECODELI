import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "@/config";
import { useTranslation } from "react-i18next";

// Types adaptés aux ENUM de la DB
type DocType =
  | "permis"
  | "piece_identite"
  | "avis_sirene"
  | "attestation_urssaf"
  | "rc_pro"
  | "diplome"
  | "siret"
  | "attestation_autoentrepreneur";
type Status = "valide" | "en_attente" | "refuse";

interface DocRow {
  id?: number;
  type: DocType;
  label: string;
  status: Status;
  fileUrl?: string;
}

const DocumentsPage = () => {
  const { t } = useTranslation();

  // Place DOC_LABELS ici, dans le composant !
  const DOC_LABELS: Record<DocType, string> = {
    permis: t("documents.permis"),
    piece_identite: t("documents.piece_identite"),
    avis_sirene: t("documents.avis_sirene"),
    attestation_urssaf: t("documents.attestation_urssaf"),
    rc_pro: t("documents.rc_pro"),
    diplome: t("documents.diplome"),
    siret: t("documents.siret"),
    attestation_autoentrepreneur: t("documents.attestation_autoentrepreneur"),
  };

  const [docs, setDocs] = useState<DocRow[]>([]);
  const [files, setFiles] = useState<Record<DocType, File | null>>({
    permis: null,
    piece_identite: null,
    avis_sirene: null,
    attestation_urssaf: null,
    rc_pro: null,
    diplome: null,
    siret: null,
    attestation_autoentrepreneur: null,
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/documents/me`, { headers });
      console.log("Données reçues de /documents/me:", data);

      // Correction : supporte réponse tableau ou objet
      const docsArray = Array.isArray(data) ? data : data.data || [];
      const map: Record<DocType, DocRow> = {
        permis: {
          type: "permis",
          label: DOC_LABELS.permis,
          status: "en_attente",
        },
        piece_identite: {
          type: "piece_identite",
          label: DOC_LABELS.piece_identite,
          status: "en_attente",
        },
        avis_sirene: {
          type: "avis_sirene",
          label: DOC_LABELS.avis_sirene,
          status: "en_attente",
        },
        attestation_urssaf: {
          type: "attestation_urssaf",
          label: DOC_LABELS.attestation_urssaf,
          status: "en_attente",
        },
        rc_pro: {
          type: "rc_pro",
          label: DOC_LABELS.rc_pro,
          status: "en_attente",
        },
        diplome: {
          type: "diplome",
          label: DOC_LABELS.diplome,
          status: "en_attente",
        },
        siret: { type: "siret", label: DOC_LABELS.siret, status: "en_attente" },
        attestation_autoentrepreneur: {
          type: "attestation_autoentrepreneur",
          label: DOC_LABELS.attestation_autoentrepreneur,
          status: "en_attente",
        },
      };
      docsArray.forEach((d: any) => {
        if (map[d.type_document as DocType]) {
          map[d.type_document as DocType] = {
            ...map[d.type_document as DocType],
            id: d.id,
            status: d.statut as Status,
            fileUrl: `${API_URL}/${d.chemin_fichier}`,
          };
        }
      });
      setDocs(Object.values(map));
    } catch (e) {
      console.error("Erreur lors du chargement des documents:", e);
      setDocs(
        Object.keys(DOC_LABELS).map((t) => ({
          type: t as DocType,
          label: DOC_LABELS[t as DocType],
          status: "en_attente",
        })),
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();

    // Refresh toutes les 30 secondes
    const interval = setInterval(refresh, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (type: DocType, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleUpload = async (type: DocType) => {
    const file = files[type];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("document", file); // Nom du champ attendu par l'API
    formData.append("type", type);

    try {
      await axios.post(`${API_URL}/documents`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
      await refresh();
      setFiles((prev) => ({ ...prev, [type]: null }));
      alert(t("documents.uploaded_success"));
    } catch (err: any) {
      console.error("Erreur lors de l'upload:", err);
      alert(
        t("documents.upload_error") +
          (err?.response?.data?.message || t("documents.upload_error_unknown")),
      );
    }
    setLoading(false);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "valide":
        return "text-green-600";
      case "refuse":
        return "text-red-600";
      case "en_attente":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case "valide":
        return t("documents.status_valid");
      case "refuse":
        return t("documents.status_refused");
      case "en_attente":
        return t("documents.status_pending");
      default:
        return t("documents.status_missing");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">{t("documents.title")}</h1>
      <div className="space-y-8">
        {docs.map((doc) => (
          <div
            key={doc.type}
            className="border rounded-lg p-6 bg-white shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">{doc.label}</h2>
            <div className="flex gap-3 items-center flex-wrap">
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(doc.type, e.target.files?.[0] || null)
                }
                className="border px-3 py-2 rounded flex-1 text-sm min-w-0"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <button
                onClick={() => handleUpload(doc.type)}
                disabled={!files[doc.type] || loading}
                className="bg-[#155250] text-white px-4 py-2 rounded text-sm disabled:opacity-50 hover:bg-[#155250]/90 transition-colors"
              >
                {loading ? t("documents.sending") : t("documents.send")}
              </button>
              <button
                onClick={refresh}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {t("documents.refresh")}
              </button>
              <span className={`font-medium ${getStatusColor(doc.status)}`}>
                {getStatusText(doc.status)}
              </span>
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {t("documents.view")}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default DocumentsPage;
