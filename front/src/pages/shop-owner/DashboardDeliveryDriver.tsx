import { JSX, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";

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

interface Stats {
    trajets: number;
    prestations: number;
    paiements: number;
    role?: string;
}

const statusLabels: Record<string, string> = {
    en_cours: "En cours",
    en_attente: "En attente",
    echeoue: "Échoué",
};

const statusColors: Record<string, string> = {
    en_cours: "bg-green-600 text-white",
    en_attente: "bg-yellow-500 text-white",
    echeoue: "bg-red-600 text-white",
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'en_cours': 'bg-blue-100 text-blue-800',
};

const DashboardProvider = () => {
    const { user, loading: userContextLoading } = useUserContext();

    const [stats, setStats] = useState<Stats | null>(null);
    const [rides, setRides] = useState<Ride[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (userContextLoading || !token || !user?.id) {
            if (!token) {
                console.warn("[DashboardProvider] Pas de token trouvé, fetch annulé.");
            } else if (!user?.id) {
                console.warn("[DashboardProvider] User ID manquant, fetch annulé.");
            } else {
                console.info("[DashboardProvider] UserContext en cours de chargement, attente...");
            }
            setLoading(false);
            return;
        }

        Promise.all([
            fetch(`${API_URL}/rides/provider/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_URL}/requests/provider/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_URL}/provider_payments/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_URL}/provider_payments/balance/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
            .then(async ([ridesRes, requestsRes, paymentsRes, balanceRes]) => {
                const ridesData = await ridesRes.json();
                const requestsData = await requestsRes.json();
                const paymentsData = await paymentsRes.json();
                const balanceData = await balanceRes.json();

                if (!ridesRes.ok) throw new Error(ridesData.message || "Erreur sur les trajets");
                if (!requestsRes.ok) throw new Error(requestsData.message || "Erreur sur les prestations");
                if (!paymentsRes.ok) throw new Error(paymentsData.message || "Erreur sur les paiements");
                if (!balanceRes.ok) throw new Error(balanceData.message || "Erreur sur le solde");

                setRides(ridesData.rides || []);
                setRequests(requestsData.requests || []);
                setPayments(paymentsData.payments || []);
                setBalance(balanceData.balance ?? 0);

                setStats({
                    trajets: ridesData.rides?.length ?? 0,
                    prestations: requestsData.requests?.length ?? 0,
                    paiements: paymentsData.payments?.length ?? 0,
                    role: user?.role ?? "-",
                });
            })
            .catch((err) => {
                setError(err.message);
                console.error("Erreur fetch DashboardProvider:", err);
            })
            .finally(() => setLoading(false));
    }, [user, userContextLoading]);

    const latestRides = [...rides]
        .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())
        .slice(0, 3);

    const latestRequests = [...requests]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

    const latestPayments = [...payments]
        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
        .slice(0, 3);

    const ongoingRides = rides.filter((r) => r.status === "en_cours");

    return (
        <main className="px-6 py-8 max-w-6xl mx-auto text-[#142D2D] font-outfit-regular min-h-[80vh]">
            <h1 className="text-3xl font-outfit-bold mb-6">Tableau de bord prestataire</h1>

            {loading || userContextLoading ? (
                <p>Chargement…</p>
            ) : error ? (
                <p className="text-red-600">Erreur : {error}</p>
            ) : (
                <>
                    {/* Statistiques */}
                    <section className="grid gap-6 sm:grid-cols-4 mb-10">
                        <Card title="Trajets" value={stats?.trajets ?? 0} />
                        <Card title="Prestations" value={stats?.prestations ?? 0} />
                        <Card title="Paiements" value={stats?.paiements ?? 0} />
                        <Card title="Solde (€)" value={balance?.toFixed(2) ?? "0.00"} />
                        <Card title="Rôle" value={stats?.role ?? "-"} />
                    </section>

                    {/* Mes trajets */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Mes trajets</h2>
                            <Link to="/app/mes-trajets-prestataire" className="text-[#155250] text-sm hover:underline">
                                Voir tout ➜
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                            {latestRides.length === 0 ? (
                                <p>Aucun trajet pour le moment.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {latestRides.map((ride) => (
                                        <li key={ride.id} className="border-b border-gray-200 pb-2">
                                            <strong>{ride.depart_address}</strong> → <strong>{ride.arrivee_address}</strong>
                                            <br />
                                            {new Date(ride.scheduled_date).toLocaleString()} -{" "}
                                            {ride.total_price !== null
                                                ? `${Number(ride.total_price).toFixed(2)} €`
                                                : "Prix non défini"}
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                                    statusColors[ride.status] || "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {statusLabels[ride.status] || ride.status.replace('_', ' ')}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Trajets à suivre */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Trajets à suivre</h2>
                            <Link to="/app/suivi-course-prestataire" className="text-[#155250] text-sm hover:underline">
                                Voir tout ➜
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                            {ongoingRides.length === 0 ? (
                                <p>Aucun trajet en cours.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {ongoingRides.map((ride) => (
                                        <li key={ride.id} className="border-b border-gray-200 pb-2">
                                            <strong>{ride.depart_address}</strong> → <strong>{ride.arrivee_address}</strong>
                                            <br />
                                            {new Date(ride.scheduled_date).toLocaleString()} -{" "}
                                            {ride.total_price !== null
                                                ? `${Number(ride.total_price).toFixed(2)} €`
                                                : "Prix non défini"}{" "}
                                            <br />
                                            <Link
                                                to={`/suivi-course-prestataire/${ride.id}`}
                                                className="text-sm text-emerald-700 hover:underline"
                                            >
                                                Suivre la course
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Mes prestations */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Mes prestations</h2>
                            <Link to="/app/mes-prestations" className="text-[#155250] text-sm hover:underline">
                                Voir tout ➜
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                            {latestRequests.length === 0 ? (
                                <p>Aucune prestation pour le moment.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {latestRequests.map((req) => (
                                        <li
                                            key={req.id}
                                            className="border-b border-gray-200 pb-2"
                                        >
                                            <strong>{req.titre}</strong> ({req.type})
                                            <br />
                                            Demandé le {new Date(req.created_at).toLocaleDateString()}
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                                    statusColors[req.status] || "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {statusLabels[req.status] || req.status.replace('_', ' ')}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Mes paiements */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Mes paiements</h2>
                            <Link to="/app/mes-paiements" className="text-[#155250] text-sm hover:underline">
                                Voir tout ➜
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                            {latestPayments.length === 0 ? (
                                <p>Aucun paiement pour le moment.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {latestPayments.map((payment) => (
                                        <li
                                            key={payment.id}
                                            className="border-b border-gray-200 pb-2"
                                        >
                                            <span>{new Date(payment.payment_date).toLocaleDateString()} — {payment.method}</span>
                                            <br />
                                            <span className="font-semibold">{payment.amount.toFixed(2)} €</span>
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                                    payment.status === "effectue"
                                                        ? "bg-green-100 text-green-800"
                                                        : payment.status === "en_attente"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {payment.status === "effectue"
                                                    ? "Payé"
                                                    : payment.status === "en_attente"
                                                        ? "En attente"
                                                        : "Échoué"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Réservations (placeholder) */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Mes réservations</h2>
                            <Link to="/app/mes-reservations" className="text-[#155250] text-sm hover:underline">
                                Voir tout ➜
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                            Aucune réservation en cours.
                        </div>
                    </section>

                    {/* Historique court (placeholder) */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Historique récent</h2>
                            <Link to="/app/historique" className="text-[#155250] text-sm hover:underline">
                                Voir tout ➜
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                            Rien à afficher.
                        </div>
                    </section>

                    {/* Parrainage / Abonnement (placeholder) */}
                    <section>
                        <div className="flex flex-col sm:flex-row gap-6">
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
                                <h3 className="font-semibold text-lg text-[#155250]">Abonnement actuel</h3>
                                <p className="text-sm text-[#155250]">Formule « Free »</p>
                                <Link
                                    to="/app/abonnement"
                                    className="text-sm text-[#155250] underline mt-auto"
                                >
                                    Voir les offres →
                                </Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default DashboardProvider;

const Card = ({
                  title,
                  value,
              }: {
    title: string;
    value: string | number;
}): JSX.Element => (
    <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-[#E9FADF]">
        <p className="text-sm text-[#155250]">{title}</p>
        <p className="text-2xl font-semibold text-[#142D2D]">{value}</p>
    </div>
);
