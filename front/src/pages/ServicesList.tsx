/* src/pages/MesPrestations.tsx */
import { useState, useEffect } from "react";
/*  import { Link } from "react-router-dom"; */
/*  import axios from "axios"; */

/* ------------ Types ------------- */
interface Prestation {
  id: number;
  label: string;
  date: string; // ISO
  status: "booked" | "done";
  price: number;
}

/* ---------- Carte Prestation ----- */
function PrestationRow({ p }: { p: Prestation }) {
  return (
    <div className="flex justify-between p-3 border-b last:border-0">
      <div className="flex flex-col">
        <span className="font-semibold">{p.label}</span>
        <span className="text-xs text-gray-500">
          {new Date(p.date).toLocaleDateString()}
        </span>
      </div>
      <div className="text-right">
        <span className="font-semibold">{p.price} €</span>
        <span
          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            p.status === "booked"
              ? "bg-[#E9FADF] text-[#155250]"
              : "bg-gray-200"
          }`}
        >
          {p.status === "booked" ? "En cours" : "Terminée"}
        </span>
      </div>
    </div>
  );
}

/* ------------ Formulaire création simple -------------- */
function PrestationForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO : appeler POST /prestations
    console.log("would POST", { label, price });
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow">
        <h2 className="text-lg font-semibold mb-4">Nouvelle prestation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Intitulé</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Prix (€)</label>
            <input
              type="number"
              min="0"
              className="w-full border px-3 py-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-gray-500">
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

/* --------------- Page principale ----------------------- */
const Prestations = () => {
  const [activeTab, setActiveTab] = useState<"current" | "historic">("current");
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Prestation[]>([]);
  const [historic, setHistoric] = useState<Prestation[]>([]);
  const [showForm, setShowForm] = useState(false);

  /* ---- mocks / remplacer par axios ---- */
  const fetchActives = async () => {
    /* const { data } = await axios.get("/prestations/me"); */
    return [
      {
        id: 1,
        label: "Cours de piano",
        date: "2025-07-03",
        status: "booked",
        price: 30,
      },
    ] as Prestation[];
  };
  const fetchHistoric = async () => {
    /* const { data } = await axios.get("/prestations/historic"); */
    return [
      {
        id: 2,
        label: "Jardinage",
        date: "2025-06-10",
        status: "done",
        price: 25,
      },
    ] as Prestation[];
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setCurrent(await fetchActives());
      setHistoric(await fetchHistoric());
      setLoading(false);
    })();
  }, []);

  const refresh = async () => {
    setCurrent(await fetchActives());
    setHistoric(await fetchHistoric());
  };

  return (
    <main className="px-6 py-8 max-w-4xl mx-auto min-h-[80vh]">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#142D2D]">Mes prestations</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#155250] text-white px-4 py-2 rounded hover:bg-[#103f3f]"
        >
          + Nouvelle prestation
        </button>
      </header>

      {/* Onglets */}
      <nav className="flex gap-4 mb-4">
        {[
          { key: "current", label: "En cours" },
          { key: "historic", label: "Historique" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`pb-2 border-b-2 ${
              activeTab === key
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
      ) : (
        <section className="bg-white rounded-xl shadow divide-y">
          {(activeTab === "current" ? current : historic).length === 0 ? (
            <p className="p-4 text-gray-500">Aucune prestation.</p>
          ) : (
            (activeTab === "current" ? current : historic).map((p) => (
              <PrestationRow key={p.id} p={p} />
            ))
          )}
        </section>
      )}

      {/* Formulaire modal */}
      {showForm && (
        <PrestationForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
    </main>
  );
};
export default Prestations;
