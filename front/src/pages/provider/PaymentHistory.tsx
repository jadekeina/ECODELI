import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";

interface PaymentHistory {
    id: number;
    amount: number;
    status: "effectue" | "en_attente" | "echeoue";
    payment_date: string;
    method: string;
}

const statusLabels: Record<string, string> = {
    all: "Tous",
    effectue: "Effectués",
    en_attente: "En attente",
    echeoue: "Échoués",
};

const PaymentsHistory = () => {
    const { user, loading: userContextLoading } = useUserContext();
    const [payments, setPayments] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const fetchPayments = useCallback(async () => {
        if (userContextLoading || !user || !user.id) {
            setLoading(false);
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token manquant");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/provider_payments/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Erreur lors de la récupération des paiements");

            const processedPayments = (data.payments || []).map((payment: any) => ({
                ...payment,
                amount: parseFloat(payment.amount),
            }));

            setPayments(processedPayments);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, userContextLoading]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    // Filtrer selon le statut
    const filteredPayments = payments.filter(payment =>
        filterStatus === "all" ? true : payment.status === filterStatus
    );

    if (loading) return <p className="p-6">Chargement des paiements...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;
    if (payments.length === 0) return <p className="p-6">Aucun paiement trouvé.</p>;
    if (filteredPayments.length === 0) return <p className="p-6">Aucun paiement "{statusLabels[filterStatus]}" trouvé.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-[#1B4F3C]">Mes paiements</h1>

            <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                            ${filterStatus === key
                            ? "bg-[#1B4F3C] text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <ul className="space-y-3">
                {filteredPayments.map(payment => (
                    <li key={payment.id} className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{payment.amount.toFixed(2)} €</span>
                                <br />
                                <span className="text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                    payment.status === "effectue" ? "bg-green-100 text-green-800" :
                                        payment.status === "en_attente" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                }`}>
                                    {statusLabels[payment.status] || payment.status}
                                </span>
                                <br />
                                <span className="text-sm">{payment.method}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-6 text-right">
                <Link
                    to="/provider/payments-history"
                    className="text-[#155250] text-sm underline"
                >
                    Voir tous les paiements →
                </Link>
            </div>
        </div>
    );
};

export default PaymentsHistory;
