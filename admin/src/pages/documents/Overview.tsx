interface Stats {
  validations: number;
  contrats: number;
  exports: number;
}

interface Links {
  validations: string;
  contrats: string;
  exports: string;
}

interface LastContrat {
  name: string;
  type: string;
  date: string;
  status: string;
  link: string;
}

interface RecentExport {
  name: string;
  type: string;
  date: string;
  link: string;
}

export default function DocumentsOverview() {
  // Mock data
  const stats: Stats = { validations: 7, contrats: 12, exports: 3 };
  const links: Links = {
    validations: "/documents/validations",
    contrats: "/documents/contrats",
    exports: "/documents/export"
  };
  const lastContrat: LastContrat = {
    name: "Fatou D.",
    type: "Prestation",
    date: "06/07/2025",
    status: "Signé",
    link: "/documents/contrats/123"
  };
  const recentExports: RecentExport[] = [
    { name: "Contrat Fatou D.", type: "Contrat", date: "06/07/2025", link: "/documents/export/123" },
    { name: "Attestation Ali B.", type: "Attestation", date: "05/07/2025", link: "/documents/export/124" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-2xl font-bold text-[#155250] mb-8">Documents — Vue d'ensemble</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte validations */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Validations de documents</h2>
              <div className="text-3xl font-bold text-[#155250] mb-2">{stats.validations}</div>
              <div className="text-gray-400 text-sm mb-4">En attente de validation</div>
            </div>
            <a
              href={links.validations}
              className="inline-flex items-center px-4 py-2 bg-[#155250] text-white rounded-lg font-medium hover:bg-[#174D4D] transition focus:ring-2 focus:ring-[#E9FADF]"
            >
              Gérer les validations
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
          {/* Carte contrats */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Contrats</h2>
              <div className="text-3xl font-bold text-[#155250] mb-2">{stats.contrats}</div>
              <div className="text-gray-400 text-sm mb-4">Contrats signés ou en cours</div>
            </div>
            <a
              href={links.contrats}
              className="inline-flex items-center px-4 py-2 bg-[#155250] text-white rounded-lg font-medium hover:bg-[#174D4D] transition focus:ring-2 focus:ring-[#E9FADF]"
            >
              Voir les contrats
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
          {/* Carte exports */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Exports</h2>
              <div className="text-3xl font-bold text-[#155250] mb-2">{stats.exports}</div>
              <div className="text-gray-400 text-sm mb-4">Exports de documents ou contrats</div>
            </div>
            <a
              href={links.exports}
              className="inline-flex items-center px-4 py-2 bg-[#155250] text-white rounded-lg font-medium hover:bg-[#174D4D] transition focus:ring-2 focus:ring-[#E9FADF]"
            >
              Exporter
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Ligne widgets */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Widget dernier contrat signé */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
            <h3 className="text-base font-bold text-[#155250] mb-3">Dernier contrat signé</h3>
            {lastContrat ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{lastContrat.name}</div>
                  <div className="text-xs text-gray-400">{lastContrat.type} • {lastContrat.date}</div>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                    lastContrat.status === "Signé"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>{lastContrat.status}</span>
                </div>
                <a
                  href={lastContrat.link}
                  className="inline-flex items-center px-3 py-2 bg-[#155250] text-white rounded-lg text-xs font-medium hover:bg-[#174D4D] transition ml-4"
                >
                  Voir le contrat
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </a>
              </div>
            ) : (
              <div className="text-gray-400">Aucun contrat signé récemment</div>
            )}
          </div>
          {/* Widget exports récents */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
            <h3 className="text-base font-bold text-[#155250] mb-3">Exports récents</h3>
            <ul>
              {recentExports && recentExports.length > 0 ? recentExports.map((ex, idx) => (
                <li key={idx} className="flex items-center justify-between py-2 border-b last:border-none hover:bg-gray-50 transition">
                  <div>
                    <div className="font-semibold text-gray-900">{ex.name}</div>
                    <div className="text-xs text-gray-400">{ex.type} • {ex.date}</div>
                  </div>
                  <a
                    href={ex.link}
                    className="inline-flex items-center px-3 py-1 bg-[#155250] text-white rounded-lg text-xs font-medium hover:bg-[#174D4D] transition ml-4"
                  >
                    Voir
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </a>
                </li>
              )) : <li className="text-gray-400">Aucun export récent</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

  