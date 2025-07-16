import { useEffect, useState } from "react";
import API_URL from "@/config";
import { useUserContext } from "@/contexts/UserContext";

interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    scheduled_date: string;
    total_price: number;
    status: string;
}

interface Request {
    id: number;
    type: string;
    titre: string;
    status: string;
    created_at: string;
}

type PaymentStatus = "effectue" | "en_attente" | "echeoue";

interface Payment {
    id: number;
    amount: number;
    status: PaymentStatus;
    payment_date: string;
    method: string;
}

const statusColors: Record<PaymentStatus, string> = {
    effectue: "text-green-600",
    en_attente: "text-yellow-600",
    echeoue: "text-red-600",
};



const DashboardProvider = () => {
    const { user } = useUserContext();

    const [rides, setRides] = useState<Ride[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) return;

        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        Promise.all([
            fetch(`${API_URL}/rides/provider/${user.id}`, { headers }),
            fetch(`${API_URL}/requests/provider/${user.id}`, { headers }),
            fetch(`${API_URL}/provider_payments/${user.id}`, { headers }),
        ])
            .then(async ([ridesRes, requestsRes, paymentsRes]) => {
                const ridesData = await ridesRes.json();
                const requestsData = await requestsRes.json();
                const paymentsData = await paymentsRes.json();

                if (!ridesRes.ok) throw new Error(ridesData.message || "Erreur sur les trajets");
                if (!requestsRes.ok) throw new Error(requestsData.message || "Erreur sur les prestations");
                if (!paymentsRes.ok) throw new Error(paymentsData.message || "Erreur sur les paiements");

                setRides(ridesData.rides || []);
                setRequests(requestsData.requests || []);
                setPayments(paymentsData.payments || []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <p className="p-6">Chargement du tableau de bord...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-4 text-[#1B4F3C]">Tableau de bord prestataire</h1>

            <section>
                <h2 className="text-xl font-semibold mb-2">Mes trajets ({rides.length})</h2>
                {rides.length === 0 ? (
                    <p>Aucun trajet pour le moment.</p>
                ) : (
                    <ul className="space-y-2">
                        {rides.map((ride) => (
                            <li key={ride.id} className="border p-3 rounded hover:bg-gray-50 cursor-pointer">
                                <div className="flex justify-between">
                                    <span>{ride.depart_address} → {ride.arrivee_address}</span>
                                    <span className="font-semibold">{ride.status}</span>
                                </div>
                                <div>
                                    <small>{new Date(ride.scheduled_date).toLocaleString()}</small>
                                    <span className="ml-4 font-semibold">{ride.total_price.toFixed(2)} €</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Mes prestations ({requests.length})</h2>
                {requests.length === 0 ? (
                    <p>Aucune prestation pour le moment.</p>
                ) : (
                    <ul className="space-y-2">
                        {requests.map((req) => (
                            <li key={req.id} className="border p-3 rounded hover:bg-gray-50 cursor-pointer">
                                <div className="flex justify-between">
                                    <span>{req.titre} ({req.type})</span>
                                    <span className="font-semibold">{req.status}</span>
                                </div>
                                <small>Demandé le {new Date(req.created_at).toLocaleDateString()}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Mes paiements ({payments.length})</h2>
                {payments.length === 0 ? (
                    <p>Aucun paiement pour le moment.</p>
                ) : (
                    <ul className="space-y-2">
                        {payments.map((payment) => (
                            <li key={payment.id} className="border p-3 rounded hover:bg-gray-50 cursor-pointer flex justify-between">
                <span>
                  {new Date(payment.payment_date).toLocaleDateString()} — {payment.method}
                </span>
                                <span className="font-semibold">{payment.amount.toFixed(2)} €</span>
                                <span
                                    className={`font-semibold ${
                                        statusColors[payment.status] ?? "text-gray-600"
                                    }`}
                                >
                  {payment.status === "effectue" ? "Payé" :
                      payment.status === "en_attente" ? "En attente" : "Échoué"}
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default DashboardProvider;
