/* --- MesTrajets.tsx ------------------------------------------------------- */
import { useEffect, useState } from "react";
 /* import { Link } from "react-router-dom";
import axios from "axios"; */

interface Trajet {
  id: number;
  cityFrom: string;
  cityTo: string;
  date: string;            // ISO
  status: "planned" | "done";
}

/* Petite ligne trajet ------------------------------------------------------ */
function TrajetRow({ t }: { t: Trajet }) {
  return (
    <div className="flex justify-between items-center p-3 border-b last:border-0">
      <div className="flex flex-col">
        <span className="font-semibold">
          {t.cityFrom} → {t.cityTo}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(t.date).toLocaleDateString()}
        </span>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          t.status === "planned"
            ? "bg-[#E9FADF] text-[#155250]"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {t.status === "planned" ? "À venir" : "Terminé"}
      </span>
    </div>
  );
}

/* Formulaire création minimal --------------------------------------------- */
function TrajetForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [cityFrom, setCityFrom] = useState("");
  const [cityTo, setCityTo] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO : POST /delivery-driver
    console.log("Would POST", { cityFrom, cityTo, date });
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow">
        <h2 className="text-lg font-semibold mb-4">Nouveau trajet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Départ</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={cityFrom}
              onChange={(e) => setCityFrom(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Destination</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={cityTo}
              onChange={(e) => setCityTo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-[#155250] text-white px-4 py-2 rounded"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Page principale ---------------------------------------------------------- */
export default function MesTrajets() {
  const [tab, setTab] = useState<"planned" | "done">("planned");
  const [loading, setLoading] = useState(true);
  const [planned, setPlanned] = useState<Trajet[]>([]);
  const [done, setDone] = useState<Trajet[]>([]);
  const [showForm, setShowForm] = useState(false);

  /* Mocks à remplacer par l’API ------------------------------------------- */
  const fetchPlanned = async () => {
    /* const { data } = await axios.get("/trajets/planned"); */
    return [
      { id: 1, cityFrom: "Paris", cityTo: "Lyon", date: "2025-07-02", status: "planned" },
    ] as Trajet[];
  };
  const fetchDone = async () => {
    /* const { data } = await axios.get("/trajets/done"); */
    return [
      { id: 2, cityFrom: "Lille", cityTo: "Paris", date: "2025-06-20", status: "done" },
    ] as Trajet[];
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPlanned(await fetchPlanned());
      setDone(await fetchDone());
      setLoading(false);
    })();
  }, []);

  const refresh = async () => {
    setPlanned(await fetchPlanned());
    setDone(await fetchDone());
  };

  return (
    <main className="px-6 py-8 max-w-4xl mx-auto min-h-[80vh]">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#142D2D]">Mes trajets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#155250] text-white px-4 py-2 rounded hover:bg-[#103f3f]"
        >
          + Nouveau trajet
        </button>
      </header>

      {/* Onglets */}
      <nav className="flex gap-4 mb-4">
        {[
          { key: "planned", label: "À venir" },
          { key: "done", label: "Historique" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`pb-2 border-b-2 ${
              tab === key ? "border-[#155250] text-[#155250]" : "border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Liste */}
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <section className="bg-white rounded-xl shadow divide-y">
          {(tab === "planned" ? planned : done).length === 0 ? (
            <p className="p-4 text-gray-500">Aucun trajet.</p>
          ) : (
            (tab === "planned" ? planned : done).map((t) => (
              <TrajetRow key={t.id} t={t} />
            ))
          )}
        </section>
      )}

      {/* Modal création */}
      {showForm && (
        <TrajetForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
    </main>
  );
}
