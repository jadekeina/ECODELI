import { useEffect, useState } from "react";
import axios from "axios";
import {
  CardElement,
  IbanElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";

interface Card {
  id: number;
  last4: string;
  brand: string;
  is_default: boolean;
}

interface HistoryRow {
  id: number;
  date: string;
  amount: number;
  label: string;
}

/* ───────────── Ajout carte (simple alert ici) */
function AddCardForm({ onCardAdded }: { onCardAdded?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe n'est pas prêt");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, token } = await stripe.createToken(cardElement as any);

    if (error) {
      setError(error.message || "Erreur lors de l'ajout de la carte");
    } else {
      alert("Token Stripe généré : " + token?.id);
      if (onCardAdded) onCardAdded();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("payment.cards")}
        </label>
        <CardElement className="border p-3 rounded" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#155250] text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? t("payment.add_card_loading") : t("payment.add_card_btn")}
        </button>
        <button
          type="button"
          onClick={() => onCardAdded?.()}
          className="px-4 py-2 border rounded text-sm"
        >
          {t("payment.cancel")}
        </button>
      </div>
    </form>
  );
}

function AddIbanForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const ibanElement = elements.getElement(IbanElement);
    const { error, token } = await stripe.createToken(ibanElement as any, {
      currency: "eur",
      // optionally add owner info
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Token IBAN Stripe généré : " + token?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">IBAN</label>
        <IbanElement
          options={{
            supportedCountries: ["SEPA"],
            placeholderCountry: "FR",
          }}
          className="border p-3 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-[#155250] text-white px-4 py-2 rounded text-sm"
      >
        {t("payment.save_iban")}
      </button>
    </form>
  );
}

const Paiement = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const [iban, setIban] = useState<string>("");
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);

  /* ───────────────────────── Fetch au mount */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/payments/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Utiliser les cookies en plus
      })
      .then(({ data }) => {
        // <— Fallbacks sûrs
        setCards(Array.isArray(data.cards) ? data.cards : []);
        setIban(data.iban || "");
        setHistory(Array.isArray(data.history) ? data.history : []);
      })
      .catch(() => {
        // en cas d'erreur serveur, on garde l'état vide
        setCards([]);
        setIban("");
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ───────────── Supprimer carte */
  const removeCard = async (id: number) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/payments/cards/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true, // Utiliser les cookies en plus
    });
    setCards((c) => c.filter((k) => k.id !== id));
  };

  /* ───────────── IBAN edit */
  const [editing, setEditing] = useState(false);
  const [newIban, setNewIban] = useState("");
  const saveIban = async () => {
    const token = localStorage.getItem("token");
    await axios.patch(
      "/payments/iban",
      { iban: newIban },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Utiliser les cookies en plus
      },
    );
    setIban(newIban);
    setEditing(false);
  };

  /* ───────────────────────── UI */
  if (loading) return <p className="p-10">{t("payment.loading")}</p>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-6">{t("payment.title")}</h1>

      {/* Cartes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t("payment.cards")}</h2>
        {cards.length === 0 && (
          <p className="text-gray-500 text-sm mb-4">
            {t("payment.no_cards")}
          </p>
        )}
        <div className="space-y-3">
          {cards.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span>
                {c.brand} •••• {c.last4}
              </span>
              <button
                onClick={() => removeCard(c.id)}
                className="text-sm text-red-600 hover:underline"
              >
                {t("payment.remove")}
              </button>
            </div>
          ))}

          {/* Ici, affiche le formulaire Stripe si demandé */}
          {showAddCard ? (
            <AddCardForm onCardAdded={() => setShowAddCard(false)} />
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full border p-3 rounded text-sm hover:bg-gray-50"
            >
              {t("payment.add_card")}
            </button>
          )}
        </div>
      </section>

      {/* IBAN */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t("payment.iban")}</h2>
        <AddIbanForm />
      </section>

      {/* Historique */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("payment.history")}</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("payment.no_history")}</p>
        ) : (
          <div className="bg-white rounded shadow divide-y text-sm">
            {history.map((h) => (
              <div key={h.id} className="flex justify-between p-3">
                <span>{new Date(h.date).toLocaleDateString()}</span>
                <span>{h.label}</span>
                <span className="font-semibold">{h.amount} €</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Paiement;
