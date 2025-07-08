import { useState} from "react";
import LineChart  from "../../components/Graph/LineChart";
import DonutChart  from "../../components/Graph/DonutChart";
import UsersTable from "../../components/Graph/UsersTable";
import DocumentTable from "@/components/Graph/DocumentTable";
import MiniRequestTable from "@/components/Graph/MiniRequestTable";

// Tu adaptes Flowbite/Charts à ton framework (voir doc Flowbite)
// Les stats sont simulées, plug API après !
const ACCENT = "#155250";
const YELLOW = "#F1F68E";
const miniUsers = [
  {
    name: "Keina P.",
    email: "keina@eco.fr",
    role: "Livreur",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "Active"
  },
  {
    name: "Jean Dupont",
    email: "jean@eco.fr",
    role: "Client",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    status: "Offline"
  }
  // etc.
];

export default function DashboardOverview() {
  // Fake data, à remplacer par fetch
  const [stats, setStats] = useState({
    inscriptionsDay: 12,
    inscriptionsWeek: 88,
    connexionsDay: 45,
    connexionsWeek: 232,
    livreursMonth: 15,
    livreursTotal: 125,
    docsPending: 70,
    demandesPending: 101,
    chiffreAffaires: 300,
    usersRole: { livreur: 72, client: 150, commercant: 27, prestataire: 10 },
    inscriptionsChart: [6, 7, 12, 14, 8, 9, 12], // 7 derniers jours
    caChart: [1000, 1200, 950, 900, 1250, 1700, 1300],
    lastUsers: [
      { name: "Keina P.", role: "Livreur", date: "03/07", avatar: "" },
      { name: "Jean Dupont", role: "Client", date: "02/07", avatar: "" }
    ],
    lastDocs: [
      { type: "CNI", user: "Sophie D.", date: "03/07" },
      { type: "Justif. de dom.", user: "Ali B.", date: "02/07" }
    ],
    lastDemandes: [
      { user: "Jade", status: "en attente", date: "03/07" },
      { user: "Sandrine", status: "traitée", date: "02/07" }
    ],
  });

  // Layout Dashboard
  return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#142D2D]">Tableau de bord</h1>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <CardStat label="Inscrits (24h)" value={stats.inscriptionsDay} />
          <CardStat label="Connexions (24h)" value={stats.connexionsDay} />
          <CardStat label="Prestations> ce mois" value={stats.livreursMonth} />
          <CardStat label="Docs à valider" value={stats.docsPending} color={YELLOW} />
        </div>
        <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
          {/* Main graph: Courbe Inscriptions */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl">{stats.inscriptionsWeek}</span>
                <h3 className="text-base font-light text-gray-500">Inscriptions cette semaine</h3>
              </div>
              <div className="flex items-center justify-end flex-1 text-base font-medium text-green-600">
                +8%
                {/* Icon */}
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              </div>
            </div>
            {/* Graph Flowbite à brancher ici */}
            <div id="inscriptions-chart" className="h-110 w-full flex items-center justify-center">
               <LineChart />
            </div>
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200">
              <button className="inline-flex items-center p-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900">
                7 derniers jours
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <a href="#" className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-[#155250] sm:text-sm hover:bg-gray-100">
                Voir plus
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
          {/* KPIs secondaires */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4">
              <DonutChart
                  labels={["CA (mois)", "Demandes", "Docs à valider"]}
                  data={[
                      stats.chiffreAffaires,
                      stats.demandesPending,
                      stats.docsPending
                  ]}
              />
          </div>
        </div>
        {/* Listes dynamiques */}
        <div className="grid gap-6 mt-8 md:grid-cols-3">
        <UsersTable users={miniUsers} showEmail={false} showRole={false} showActions={false} rowsLimit={3} />

        <DocumentTable
  compact
  documents={[
    {
      id: 1,
      user: "Sophie D.",
      email: "sophie@eco.fr",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      type: "CNI",
      date: "03/07",
      status: "En attente",
    },
    {
      id: 2,
      user: "Ali B.",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      type: "Justif. dom.",
      date: "02/07",
      status: "En attente",
    },
  ]}
/>
<MiniRequestTable
  requests={[
    { prestation: "Livraison express", auteur: "Fatou D.", jour: "06/07", prix: "12,00 €" },
    { prestation: "Transport box", auteur: "Kevin T.", jour: "05/07", prix: "20,00 €" },
    { prestation: "Courses", auteur: "Keina P.", jour: "05/07", prix: "7,50 €" },
  ]}
/>


        </div>
      </div>
  );
}

// Composants utilitaires
function CardStat({ label, value, color = "#155250" }: { label: string; value: number; color?: string }) {
  return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col gap-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      </div>
  );
}
function WidgetLabel({ label, value }: { label: string; value: string | number }) {
  return (
      <div>
        <span className="text-xs text-gray-400">{label}</span>
        <div className="text-xl font-bold text-[#155250]">{value}</div>
      </div>
  );
}
function WidgetList({ title, items }: { title: string; items: string[] }) {
  return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <h4 className="font-semibold text-[#142D2D] mb-2">{title}</h4>
        <ul>
          {items.map((item: string, i: number) => (
              <li key={i} className="py-1 border-b border-gray-100 last:border-none">{item}</li>
          ))}
        </ul>
      </div>
  );
}

