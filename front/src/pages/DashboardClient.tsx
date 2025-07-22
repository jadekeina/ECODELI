import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/** -------------------------------------------------
 * Dashboard – Vue d'ensemble (client)
 * Palette EcoDeli : #142D2D | #155250 | #E9FADF | #F1F68E
 * -------------------------------------------------*/

interface Stats {
  trajets: number;
  prestations: number;
  role: string;
}

const Card = ({ title, value }: { title: string; value: string | number }) => (
  <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-[#E9FADF]">
    <p className="text-sm text-[#155250]">{title}</p>
    <p className="text-2xl font-semibold text-[#142D2D]">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("/stats/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="px-6 py-8 max-w-8xl mx-auto text-[#142D2D] font-outfit-regular min-h-[80vh]">
      <div className="bg-[#E9FADF] w-full px-8 lg:px-12 py-10 lg:py-13 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm">
        <div className="p-5 px-15">
          <h1 className="text-3xl lg:text-4xl font-outfit-bold font-bold mb-1">
            Tableau de Bord
          </h1>
          <p className="text-sm lg:text-base text-[#155250]/80">
            Gérez vos services, colis et réservations en un coup d’œil.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            className="flex items-center gap-2 bg-[#155250] hover:bg-[#155250]/90 text-white text-lg font-medium px-6 py-4 rounded-lg shadow transition"
            onClick={() => navigate("/deposer-annonce")}
          >
            <span className="i-heroicons-plus-circle-16-solid" />
            Créer un colis / annonce
          </button>
          <button className="flex items-center gap-2 bg-[#F97315] hover:bg-[#F96315] text-white text-lg font-medium px-6 py-4 rounded-lg shadow transition">
            <span className="i-heroicons-calendar-days-16-solid" />
            Réserver un service
          </button>
        </div>
      </div>

      {/* ===== Stat cards ============================================= */}
      <section className="max-w-8xl mx-auto px-6 lg:px-12 -mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: "Colis totaux", value: 0 },
          { label: "En cours", value: 0 },
          { label: "Livrés", value: 0 },
          { label: "Total dépensé", value: "0 €" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-[#E9FADF] rounded-xl p-5 shadow text-center"
          >
            <p className="text-sm text-[#155250] mb-1">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      {/* ===== Aperçu activité ======================================== */}
      <section className="max-w-8xl mx-auto px-6 lg:px-12 mt-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b text-lg font-medium text-[#155250]">
            {[
              "Aperçu",
              "Mes colis",
              "Mes commandes",
              "Mes réservations",
              "Notifications",
              "Historique paiements",
              "Messages",
            ].map((tab, i) => (
              <button
                key={tab}
                className={`px-6 py-3 flex-1 text-center transition ${i === 0 ? "border-b-2 border-[#155250] bg-[#F9FDFB]" : "hover:bg-gray-50"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contenu Aperçu */}
          <div className="p-8 grid lg:grid-cols-3 gap-8 text-md text-gray-700">
            <div>
              <h3 className="font-semibold text-[#155250] mb-2">
                Colis récents
              </h3>
              <p className="text-gray-500">Aucun colis récent</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#155250] mb-2">
                Réservations
              </h3>
              <p className="text-gray-500">Aucune réservation en cours</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#155250] mb-2">
                Notifications
              </h3>
              <p className="text-gray-500">Aucune notification</p>
            </div>
          </div>
        </div>
      </section>
      {/* ================= PARRAINAGE / ABONNEMENT ================= */}
      <section>
        <div className="flex flex-col sm:flex-row gap-6 mt-10">
          {/* Parrainage */}
          <div className="flex-1 bg-[#E9FADF] p-6 rounded-xl flex flex-col items-start gap-3 shadow">
            <h3 className="font-semibold text-lg text-[#155250]">Parrainage</h3>
            <p className="text-sm text-[#155250]">
              Invitez vos proches et gagnez des crédits livraison.
            </p>
            <Link
              to="/app/parrainage"
              className="bg-[#155250] text-white text-sm px-4 py-2 rounded-md mt-auto"
            >
              Obtenir mon lien
            </Link>
          </div>

          {/* Abonnement */}
          <div className="flex-1 bg-white border border-[#F1F68E] p-6 rounded-xl flex flex-col gap-3 shadow">
            <h3 className="font-semibold text-lg text-[#155250]">
              Abonnement actuel
            </h3>
            <p className="text-sm text-[#155250]">Formule « Free »</p>
            <Link
              to="/app/abonnement"
              className="text-sm text-[#155250] underline mt-auto"
            >
              Voir les offres →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
