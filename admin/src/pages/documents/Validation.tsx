interface Document {
  id?: number;
  user: string;
  type: string;
  date: string;
  status: string;
}

interface DocumentsValidationsProps {
  documents: Document[];
}

export default function DocumentsValidations({ documents }: DocumentsValidationsProps) {
    // Données de test si aucun document n'est fourni
    const testDocuments: Document[] = [
        { id: 1, user: "Jean Dupont", type: "Carte d'identité", date: "2024-01-15", status: "En attente" },
        { id: 2, user: "Marie Martin", type: "Permis de conduire", date: "2024-01-14", status: "Validé" },
        { id: 3, user: "Pierre Durand", type: "Justificatif de domicile", date: "2024-01-13", status: "En attente" }
    ];

    const displayDocuments = documents.length > 0 ? documents : testDocuments;

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
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayDocuments.map((doc: Document, idx: number) => (
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
                    <td className="px-4 py-3 text-right space-x-2">
                      <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">Valider</button>
                      <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Refuser</button>
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
  