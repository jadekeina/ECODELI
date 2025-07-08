type Document = {
  id: number;
  user: string;
  email?: string;
  avatar?: string;
  type: string;
  date: string;
  status: string;
};
type DocumentTableProps = {
  documents: Document[];
  compact?: boolean;
};

export default function DocumentTable({ documents, compact }: DocumentTableProps) {
  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="text-base font-bold text-gray-900 mb-3">Docs à valider</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 font-semibold">Utilisateur</th>
              <th className="px-4 py-2 font-semibold">Type</th>
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={doc.id || idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{doc.user}</td>
                <td className="px-4 py-2 whitespace-nowrap">{doc.type}</td>
                <td className="px-4 py-2 whitespace-nowrap">{doc.date}</td>
                <td className="px-4 py-2 whitespace-nowrap">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-2">
        <a href="/documents/validations" className="text-xs text-[#155250] hover:underline font-medium">
          Voir tout
        </a>
      </div>
    </div>
  );
}
