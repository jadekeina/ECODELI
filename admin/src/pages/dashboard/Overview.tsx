import axios from "axios";
import { useEffect, useState } from "react";
import LineChart from "../../components/Graph/LineChart";
import UsersTable from "../../components/Graph/UsersTable";
import DocumentTable from "@/components/Graph/DocumentTable";
import MiniRequestTable from "@/components/Graph/MiniRequestTable";
import CACard from "@/components/Graph/CACard";

const API_URL = import.meta.env.VITE_API_URL;

const YELLOW = "#F1F68E";
const miniUsers = [
  // ... (identique à avant)
];

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    inscriptionsDay: 0,
    inscriptionsWeek: 0,
    connexionsDay: 0,
    connexionsWeek: 0,
    livreursMonth: 0,
    livreursTotal: 0,
    docsPending: 0,
    demandesPending: 0,
    chiffreAffaires: 0,
    caPercent: 0,
    inscriptionsChart: [0, 0, 0, 0, 0, 0, 0], // 7 derniers jours
    caChart: [0, 0, 0, 0, 0, 0, 0],
    lastUsers: [],
    lastDocs: [],
    lastDemandes: [],
  });

  useEffect(() => {
    // Inscrits 24h
    axios.get(`${API_URL}/api/users/inscrits-24h`)
      .then(res => setStats(s => ({ ...s, inscriptionsDay: res.data.count })))
      .catch(err => console.error("Erreur Inscrits 24h:", err));

    // Connexions 24h
    axios.get(`${API_URL}/api/users/connexions-24h`)
      .then(res => setStats(s => ({ ...s, connexionsDay: res.data.count })))
      .catch(err => console.error("Erreur Connexions 24h:", err));

    // Inscriptions par jour (courbe)
    axios.get(`${API_URL}/api/stats/inscriptions/semaine`)
      .then(res => setStats(s => ({ ...s, inscriptionsChart: res.data.data })))
      .catch(err => console.error("Erreur Inscriptions semaine:", err));

    // Chiffre d'affaires FAKE (à remplacer par vrai endpoint + data réelle après)
    axios.get(`${API_URL}/api/stats/ca/fake`)
      .then(res => setStats(s => ({
        ...s,
        chiffreAffaires: res.data.chiffreAffaires,
        caChart: res.data.chart,
        caPercent: res.data.evolution
      })))
      .catch(err => console.error("Erreur CA :", err));

   // Derniers inscrits
axios.get(`${API_URL}/api/users/last?limit=5`)
.then(res => setStats(s => ({
  ...s,
  lastUsers: res.data.users
})))
.catch(err => console.error("Erreur derniers inscrits:", err));


    // (Remets les autres kpi plus tard si tu veux)
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#142D2D]">Tableau de bord</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mb-8">
        <CardStat label="Inscrits (24h)" value={stats.inscriptionsDay} />
        <CardStat label="Connexions (24h)" value={stats.connexionsDay} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        {/* Main graph: Courbe Inscriptions */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl">
                {stats.inscriptionsChart.reduce((a, b) => a + b, 0)}
              </span>
              <h3 className="text-base font-light text-gray-500">Inscriptions cette semaine</h3>
            </div>
            <div className="flex items-center justify-end flex-1 text-base font-medium text-green-600">
              {/* Tu peux calculer la variation en % ici si tu veux */}
              {/* +8% */}
            </div>
          </div>
          <div id="inscriptions-chart" className="h-110 w-full flex items-center justify-center">
            {/* LineChart avec vraie data */}
            <LineChart data={stats.inscriptionsChart} />
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4">
        <CACard
  value={stats.chiffreAffaires + " €"}
  title="Chiffre d'affaires cette semaine"
  percent={stats.caPercent}
  percentColor={stats.caPercent >= 0 ? "text-green-500" : "text-red-500"}
  percentIconUp={stats.caPercent >= 0}
  chartData={stats.caChart} // => les vraies données de l’API
  chartLabels={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
/>



        </div>
      </div>
      {/* Listes dynamiques */}
      <div className="grid gap-6 mt-8 md:grid-cols-3">
      <UsersTable
      usersApi={stats.lastUsers}  // Ou tous les users de l'API
      showEmail={true}
      showRole={true}
      showActions={false}
      rowsLimit={5} // ou null pour tout afficher
      showSeeMore={true}
      seeMoreHref="../utilisateurs/Overview"
      />
        
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
function CardStat({ label, value, color = "#155250" }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
    </div>
  );
}
