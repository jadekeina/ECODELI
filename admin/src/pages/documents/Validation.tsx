import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../config";

interface Document {
  id?: number;
  user: string;
  type: string;
  date: string;
  status: string;
  fileUrl?: string;
  userId?: number;
}

export default function DocumentsValidations() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        console.log("GET", `${API_URL}/documents/pending`);
        const { data } = await axios.get(`${API_URL}/documents/pending`);
        console.log("Réponse API /documents/pending:", data);
        const docsArray = Array.isArray(data) ? data : data.data || [];
        console.log("docsArray =", docsArray);
        console.log("Réponse API /documents/me:", data);
        setDocuments(
          docsArray.map((doc: any) => ({
            id: doc.id,
            user: doc.firstname + " " + doc.lastname,
            type: doc.type_document,
            date: doc.date_upload?.slice(0, 10),
            status: doc.statut === "en_attente" ? "En attente" : doc.statut === "valide" ? "Validé" : "Refusé",
            fileUrl: doc.chemin_fichier ? `/` + doc.chemin_fichier : undefined,
            userId: doc.user_id,
          }))
        );
        console.log("Réponse API /documents/me:", data);
      } catch (e) {
        console.error("Erreur lors du chargement des documents:", e);
        
        setDocuments([]);
      }
      setLoading(false);
    };

    useEffect(() => { fetchDocuments(); }, []);

    const handleValidation = async (id: number, statut: "valide" | "refuse") => {
      setLoading(true);
      try {
        console.log("PATCH", `${API_URL}/documents/${id}`, { statut });
        await axios.patch(`${API_URL}/documents/${id}`, { statut });
        await fetchDocuments();
      } catch (e) {
        console.error("Erreur lors de la validation/refus:", e);
        alert("Erreur lors de la validation/refus");
        
      }
      setLoading(false);
    };

    

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-2xl font-bold text-[#155250] mb-8">Validations de documents</h1>
          <div className="bg-white rounded-xl  p-6">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: Document, idx: number) => (
                  <tr key={doc.id || idx} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{doc.user}</td>
                    <td className="px-4 py-3">{doc.type}</td>
                    <td className="px-4 py-3">{doc.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        doc.status === "En attente"
                          ? "bg-yellow-100 text-yellow-700"
                          : doc.status === "Validé"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {doc.fileUrl && (
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir</a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                        onClick={() => handleValidation(doc.id!, "valide")}
                        disabled={loading}
                      >Valider</button>
                      <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                        onClick={() => handleValidation(doc.id!, "refuse")}
                        disabled={loading}
                      >Refuser</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  