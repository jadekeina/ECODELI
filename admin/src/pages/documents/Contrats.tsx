interface Contrat {
  id?: number;
  nom: string;
  type: string;
  date: string;
  statut: string;
  link?: string;
}

interface DocumentsContratsProps {
  contrats: Contrat[];
}

export default function DocumentsContrats({ contrats }: DocumentsContratsProps) {
    // Données de test si aucun contrat n'est fourni
    const testContrats: Contrat[] = [
        { id: 1, nom: "Contrat prestataire", type: "Prestation", date: "2024-01-15", statut: "Signé", link: "#" },
        { id: 2, nom: "Contrat livreur", type: "Livraison", date: "2024-01-12", statut: "En attente", link: "#" },
        { id: 3, nom: "Contrat commerçant", type: "Commerce", date: "2024-01-10", statut: "Signé", link: "#" }
    ];

    const displayContrats = contrats.length > 0 ? contrats : testContrats;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-2xl font-bold text-[#155250] mb-8">Liste des contrats</h1>
          <div className="bg-white rounded-xl  p-6">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayContrats.map((ct: Contrat, idx: number) => (
                  <tr key={ct.id || idx} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{ct.nom}</td>
                    <td className="px-4 py-3">{ct.type}</td>
                    <td className="px-4 py-3">{ct.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        ct.statut === "Signé"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {ct.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={ct.link || "#"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#155250] rounded-lg hover:bg-[#174D4D] transition">Voir</a>
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
  