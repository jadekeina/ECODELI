interface Alert {
    title: string;
    date: string;
    level: "urgent" | "warning" | "info";
    link?: string;
  }
  
  export default function Alerts() {
    const alerts: Alert[] = [
      { title: "3 documents en attente de validation", date: "07/07/2025", level: "urgent", link: "/documents/validations" },
      { title: "1 demande signalée par un client", date: "07/07/2025", level: "warning", link: "/services/livraisons" },
      { title: "2 paiements échoués cette semaine", date: "06/07/2025", level: "info", link: "/finance/transactions" },
      { title: "Nouveau ticket support #3201", date: "06/07/2025", level: "info", link: "/support/tickets" },
    ];
  
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#155250] mb-6">Alertes à traiter</h1>
          <ul className="space-y-3">
            {alerts.length === 0 && (
              <li>
                <div className="bg-white rounded-lg p-4 shadow flex items-center">
                  <span className="text-gray-400">Aucune alerte pour l’instant !</span>
                </div>
              </li>
            )}
            {alerts.map((alert, idx) => (
              <li key={idx}>
                <div className="bg-white border border-gray-200 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-sm px-4 py-3 hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span
                      className={`
                        inline-block w-2.5 h-2.5 rounded-full
                        ${alert.level === "urgent" ? "bg-red-500" : alert.level === "info" ? "bg-blue-500" : "bg-yellow-400"}
                      `}
                      title={alert.level}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{alert.title}</div>
                      <div className="text-xs text-gray-400">{alert.date}</div>
                    </div>
                  </div>
                  {alert.link && (
                    <a
                      href={alert.link}
                      className={`
                        mt-2 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-semibold 
                        rounded-lg shadow-sm focus:outline-none focus:ring-2
                        ${alert.level === "urgent"
                          ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300"
                          : alert.level === "info"
                          ? "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300"
                          : "bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-200"}
                      `}
                    >
                      Voir
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  