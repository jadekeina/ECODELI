import { useEffect, useState } from "react";
import axios from "axios";

type DocType = "cni" | "justif" | "permis";
type Status = "valid" | "pending" | "missing";

interface DocRow {
  id?: number;
  type: DocType;
  label: string;
  status: Status;
  fileUrl?: string;
}

const DOC_LABELS: Record<DocType, string> = {
  cni: "Carte d’identité (recto/verso)",
  justif: "Justificatif de domicile < 3 mois",
  permis: "Permis de conduire",
};


const DocumentsPage = () => {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [files, setFiles] = useState<Record<DocType, File | null>>({
    cni: null,
    justif: null,
    permis: null,
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/documents", { headers });
      const map: Record<DocType, DocRow> = {
        cni: { type: "cni", label: DOC_LABELS.cni, status: "missing" },
        justif: { type: "justif", label: DOC_LABELS.justif, status: "missing" },
        permis: { type: "permis", label: DOC_LABELS.permis, status: "missing" },
      };
      data.forEach((d: any) => {
        if (map[d.type as DocType]) {
          map[d.type as DocType] = {
            ...map[d.type as DocType],
            id: d.id,
            status: d.status as Status,
            fileUrl: d.url, // si API renvoie URL
          };
        }
      });
      setDocs(Object.values(map));
    } catch (e) {
      setDocs(Object.keys(DOC_LABELS).map(t => ({
        type: t as DocType,
        label: DOC_LABELS[t as DocType],
        status: "missing",
      })));
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleFileChange = (type: DocType, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleUpload = async (type: DocType) => {
    if (!files[type]) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", files[type] as Blob);

    try {
      await axios.post(`/documents/${type}`, formData, { headers });
      await refresh();
      setFiles((prev) => ({ ...prev, [type]: null }));
    } catch (err) {
      alert("Erreur lors de l’upload !");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Documents à fournir</h1>
      <div className="space-y-8">
        {docs.map(doc => (
          <div key={doc.type}>
            <h2 className="text-lg font-semibold mb-2">{doc.label}</h2>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                onChange={e => handleFileChange(doc.type, e.target.files?.[0] || null)}
                className="border px-3 py-2 rounded flex-1 text-sm"
              />
              <button
                onClick={() => handleUpload(doc.type)}
                disabled={!files[doc.type] || loading}
                className="bg-[#155250] text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                Envoyer
              </button>
              {doc.status !== "missing" && (
                <span
                  className={
                    doc.status === "valid"
                      ? "text-green-600"
                      : doc.status === "pending"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }
                >
                  {doc.status === "valid"
                    ? "Validé"
                    : doc.status === "pending"
                    ? "En attente"
                    : "Non fourni"}
                </span>
              )}
              {doc.fileUrl && (
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">
                  Voir
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
