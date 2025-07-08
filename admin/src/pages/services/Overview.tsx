import { Package } from "lucide-react";
import BarChart2 from "../../components/Graph/BarChart2";
import { ServicesPieChart } from "../../components/Graph/PieChart";
import ComposantTable from "../../components/Graph/ComposantTable";

// Exemple d'annonces récentes
const annonces = [
  {
    auteur: "Keina P.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    date: "07/07/2025, 10:31",
    texte: "Colis volumineux à livrer rapidement à Montrouge.",
    replies: 3,
  },
  {
    auteur: "Sandrine B.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    date: "06/07/2025, 15:21",
    texte: "Cherche livreur pour trajet Paris > Massy, urgent.",
    replies: 1,
  },
];

export default function Overview() {
  // MOCK DATA EXEMPLE
  const statsBar = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      { label: 'Livraisons', data: [17, 14, 24, 19, 21, 15, 18] },
      { label: 'Prestations', data: [8, 7, 10, 6, 12, 9, 7] }
    ]
  };
  const statsPie = {
    labels: ['Livraisons', 'Prestations', 'Annonces', 'Box'],
    values: [300, 120, 50, 30]
  };
  const columns = ["Nom", "Type", "Date", "Statut"];
  const rows = [
    ["Colis #1231", "Livraison", "07/07/2025", "En cours"],
    ["Colis #1208", "Livraison", "06/07/2025", "Livré"],
    ["Presta #A54", "Prestation", "06/07/2025", "Validée"]
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 flex flex-col gap-8">
      {/* GRAPHIQUES */}
      <div className=" flex grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        <div>   <BarChart2
          data={statsBar}
          title="Services réalisés cette semaine"
          subtitle="Volume quotidien par type"
          icon={<Package className="text-[#155250] w-6 h-6" />}
          chartKey="services-bar-week"
        /> </div>
     

        <div>  <ServicesPieChart data={statsPie} title="Répartition des services"  /> </div>
      
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto w-full">
        <h3 className="text-lg font-semibold mb-4 text-[#155250]">Dernières opérations</h3>
        <ComposantTable columns={columns} rows={rows} />
      </div>

      {/* ANNONCES EN BAS */}
      <div className="max-w-6xl mx-auto w-full mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#155250]">Annonces récentes</h3>
            <a
              href="#"
              className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-[#155250] hover:bg-[#142D2D] transition"
            >
              Voir tout
            </a>
          </div>
          {/* Liste d'annonces */}
          <div className="space-y-5 max-h-72 overflow-y-auto">
            {annonces.map((a, idx) => (
              <article key={idx}>
                <footer className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm font-semibold text-gray-900">
                      <img className="w-6 h-6 mr-2 rounded-full" src={a.avatar} alt={a.auteur} />
                      {a.auteur}
                    </p>
                    <p className="text-xs text-gray-400">{a.date}</p>
                  </div>
                </footer>
                <p className="mb-2 text-gray-900">{a.texte}</p>
                <a href="#" className="inline-flex items-center text-xs font-medium text-[#155250]">
                  {a.replies} réponses
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </a>
              </article>
            ))}
            {annonces.length === 0 && (
              <div className="text-gray-400 text-sm text-center">Aucune annonce pour le moment</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
