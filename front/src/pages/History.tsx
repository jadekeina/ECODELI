import { useEffect, useState } from "react";
import axios from "axios";

/* ----------- Types ----------- */
interface Row {
  id: number;
  type: "trajet" | "prestation";
  label: string; // ex: "Paris → Lyon" ou "Jardinage"
  date: string; // ISO string
  price?: number; // pour prestation
}

/* ------- Ligne tableau ------- */
function HistoryRow({ r }: { r: Row }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 border-b last:border-0">
      <span className="capitalize">{r.type}</span>
      <span className="sm:col-span-2">{r.label}</span>
      <span className="text-right">
        {new Date(r.date).toLocaleDateString()}
        {r.price !== undefined && (
          <span className="ml-4 font-semibold">{r.price} €</span>
        )}
      </span>
    </div>
  );
}

/* ----------- Page ------------- */
const History = () => {
  const [tab, setTab] = useState<"all" | "trajet" | "prestation">("all");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  /* ---------- Mocks à remplacer par l’API ---------- */
  const fetchHistoricTrajets = async (): Promise<Row[]> => [
    {
      id: 1,
      type: "trajet",
      label: "Lille → Paris",
      date: "2025-06-15",
    },
  ];

  const fetchHistoricPrestations = async (): Promise<Row[]> => [
    {
      id: 2,
      type: "prestation",
      label: "Cours de piano",
      date: "2025-06-22",
      price: 30,
    },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [t, p] = await Promise.all([
        fetchHistoricTrajets(),
        fetchHistoricPrestations(),
      ]);
      // fusion + tri desc
      setRows(
        [...t, ...p].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
      );
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter((r) => tab === "all" || r.type === tab);

  /* --------------- UI --------------- */
  return (
    <main className="px-6 py-8 max-w-4xl mx-auto min-h-[80vh]">
      <h1 className="text-3xl font-bold text-[#142D2D] mb-6">Historique</h1>

      {/* Onglets filtres */}
      <nav className="flex gap-4 mb-4">
        {[
          { key: "all", label: "Tout" },
          { key: "trajet", label: "Trajets" },
          { key: "prestation", label: "Prestations" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`pb-2 border-b-2 ${
              tab === key
                ? "border-[#155250] text-[#155250]"
                : "border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Liste */}
      {loading ? (
        <p>Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Aucun historique pour le moment.</p>
      ) : (
        <section className="bg-white rounded-xl shadow divide-y">
          {filtered.map((r) => (
            <HistoryRow key={r.id} r={r} />
          ))}
        </section>
      )}
    </main>
  );
};
export default History;
