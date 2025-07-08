interface Export {
  id?: number;
  nom: string;
  type: string;
  date: string;
  link?: string;
}

interface DocumentsExportsProps {
  exportsList: Export[];
}

export default function DocumentsExports({ exportsList }: DocumentsExportsProps) {
    // Données de test si aucun export n'est fourni
    const testExports: Export[] = [
        { id: 1, nom: "Rapport mensuel", type: "PDF", date: "2024-01-15", link: "#" },
        { id: 2, nom: "Export utilisateurs", type: "CSV", date: "2024-01-10", link: "#" },
        { id: 3, nom: "Statistiques trimestrielles", type: "Excel", date: "2024-01-08", link: "#" }
    ];

    const displayExports = exportsList.length > 0 ? exportsList : testExports;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-2xl font-bold text-[#155250] mb-8">Exports de documents</h1>
          <div className="bg-white rounded-xl p-6">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Télécharger</th>
                </tr>
              </thead>
              <tbody>
                {displayExports.map((ex: Export, idx: number) => (
                  <tr key={ex.id || idx} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{ex.nom}</td>
                    <td className="px-4 py-3">{ex.type}</td>
                    <td className="px-4 py-3">{ex.date}</td>
                    <td className="px-4 py-3 text-right">
                      <a href={ex.link || "#"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#155250] rounded-lg hover:bg-[#174D4D] transition">Télécharger</a>
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
  