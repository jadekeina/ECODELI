import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import API_URL from "@/config";

/** -------------------------------------------------
 * Dashboard – Vue d'ensemble (provider)
 * Palette EcoDeli : #142D2D | #155250 | #E9FADF | #F1F68E
 * -------------------------------------------------*/

// Interfaces pour les données
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
    id: number; // Assurez-vous que l'ID est un nombre ou une chaîne selon votre DB
    amount: number; // <-- Assurez-vous que c'est un nombre
    status: PaymentStatus;
    payment_date: string;
    method: string;
}

interface Stats {
    trajets: number;
    prestations: number;
    paiements: number; // Nombre de paiements effectués
    role?: string;
}

// Labels et couleurs pour les statuts (utilisés pour les paiements et autres)
const statusLabels: Record<string, string> = {
    en_cours: "En cours",
    en_attente: "En attente",
    echeoue: "Échoué",
    effectue: "Effectué", // Ajouté pour les paiements
};

const statusColors: Record<string, string> = {
    en_cours: "bg-blue-100 text-blue-800",
    en_attente: "bg-yellow-100 text-yellow-800",
    echeoue: "bg-red-100 text-red-800",
    effectue: "bg-green-100 text-green-800",
};

// Composant Card réutilisable pour les statistiques
const Card = ({ title, value }: { title: string; value: string | number }): JSX.Element => (
    <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-[#E9FADF]">
        <p className="text-sm text-[#155250]">{title}</p>
        <p className="text-2xl font-semibold text-[#142D2D]">{value}</p>
    </div>
);

const DashboardProvider = () => {
    const { user, loading: userContextLoading } = useContext(UserContext);

    const [stats, setStats] = useState<Stats | null>(null);
    const [rides, setRides] = useState<Ride[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [balance, setBalance] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userContextLoading || !user || !user.id) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token d'authentification manquant.");
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = user.id;

                const [ridesRes, requestsRes, paymentsRes, balanceRes] = await Promise.all([
                    fetch(`${API_URL}/rides/provider/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/requests/provider/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/provider_payments/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/provider_payments/balance/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const ridesData = await ridesRes.json();
                const requestsData = await requestsRes.json();
                const paymentsData = await paymentsRes.json();
                const balanceData = await balanceRes.json();

                if (!ridesRes.ok) throw new Error(ridesData.message || "Erreur lors de la récupération des trajets.");
                if (!requestsRes.ok) throw new Error(requestsData.message || "Erreur lors de la récupération des prestations.");
                if (!paymentsRes.ok) throw new Error(paymentsData.message || "Erreur lors de la récupération des paiements.");
                if (!balanceRes.ok) throw new Error(balanceData.message || "Erreur lors de la récupération du solde.");

                setRides(ridesData.rides || []);
                setRequests(requestsData.requests || []);

                // Correction ici : Mapper les paiements pour s'assurer que 'amount' est un nombre
                const processedPayments = (paymentsData.payments || []).map((payment: any) => ({
                    ...payment,
                    amount: parseFloat(payment.amount), // Convertir en nombre
                    id: payment.id // S'assurer que l'ID est bien transféré
                }));
                setPayments(processedPayments);

                const fetchedBalance = parseFloat(balanceData.balance);
                setBalance(isNaN(fetchedBalance) ? 0 : fetchedBalance);

                setStats({
                    trajets: ridesData.rides?.length ?? 0,
                    prestations: requestsData.requests?.length ?? 0,
                    paiements: processedPayments.length ?? 0, // Utiliser la longueur des paiements traités
                    role: user?.role ?? "-",
                });

            } catch (err: any) {
                setError(err.message);
                console.error("[DashboardProvider] Erreur lors du fetch des données du tableau de bord:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, userContextLoading]);

    if (loading || userContextLoading) return <p className="p-6">Chargement du tableau de bord prestataire...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;

    const latestRides = [...rides].sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()).slice(0, 3);
    const latestRequests = [...requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
    const latestPayments = [...payments].sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()).slice(0, 3);
    const ongoingRides = rides.filter((r) => r.status === "en_cours");


    return (
        <main className="px-6 py-8 max-w-6xl mx-auto text-[#142D2D] font-outfit-regular min-h-[80vh]">
            <h1 className="text-3xl font-outfit-bold mb-6">Tableau de bord Prestataire</h1>

            {/* ================= SOLDE ACTUEL ================= */}
            {balance !== null && (
                <section className="rounded-xl bg-white shadow p-4 mb-6 flex flex-col gap-1 border border-[#E9FADF]">
                    <p className="text-sm text-[#155250]">Solde actuel</p>
                    <p className="text-2xl font-semibold text-[#142D2D]">
                        <span className="text-green-600">{balance?.toFixed(2) ?? '0.00'} €</span>
                    </p>
                    <Link to="/provider/payments-history" className="text-sm text-[#155250] underline mt-2">
                        Voir l'historique des paiements →
                    </Link>
                </section>
            )}

            {/* ================= STAT CARDS ================= */}
            {stats && (
                <section className="grid gap-6 sm:grid-cols-3 mb-10">
                    <Card title="Trajets" value={stats.trajets ?? 0} />
                    <Card title="Prestations" value={stats.prestations ?? 0} />
                    <Card title="Paiements effectués" value={stats.paiements ?? 0} />
                    <Card title="Rôle" value={stats.role ?? "-"} />
                </section>
            )}

            {/* ================= MES TRAJETS À VENIR ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes trajets à venir</h2>
                    <Link to="/provider/courses" className="text-[#155250] text-sm hover:underline">
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {latestRides.length === 0 ? (
                        <p>Aucun trajet planifié pour le moment.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestRides.map((ride) => (
                                <li key={ride.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                    <strong>{ride.depart_address}</strong> →{" "}
                                    <strong>{ride.arrivee_address}</strong>
                                    <br />
                                    {new Date(ride.scheduled_date).toLocaleString()}{" "}
                                    -{" "}
                                    {ride.total_price !== null
                                        ? `${Number(ride.total_price).toFixed(2)} €`
                                        : "Prix non défini"}
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                        statusColors[ride.status] || "bg-gray-100 text-gray-800"
                                    }`}>
                                        {statusLabels[ride.status] || ride.status.replace('_', ' ')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* ================= TRAJETS EN COURS (Ongoing Rides) ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Trajets en cours</h2>
                    <Link to="/provider/courses" className="text-[#155250] text-sm hover:underline">
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {ongoingRides.length === 0 ? (
                        <p>Aucun trajet en cours.</p>
                    ) : (
                        <ul className="space-y-3">
                            {ongoingRides.map((ride) => (
                                <li key={ride.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                    <strong>{ride.depart_address}</strong> →{" "}
                                    <strong>{ride.arrivee_address}</strong>
                                    <br />
                                    {new Date(ride.scheduled_date).toLocaleString()}{" "}
                                    -{" "}
                                    {ride.total_price !== null
                                        ? `${Number(ride.total_price).toFixed(2)} €`
                                        : "Prix non défini"}{" "}
                                    <br />
                                    <Link
                                        to={`/provider/courses/${ride.id}`}
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

            {/* ================= MES DERNIÈRES PRESTATIONS (Requests) ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes dernières prestations</h2>
                    <Link to="/mes-prestations" className="text-[#155250] text-sm hover:underline">
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {latestRequests.length === 0 ? (
                        <p>Aucune prestation pour le moment.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestRequests.map((req) => (
                                <li key={req.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                    <strong>{req.titre}</strong> ({req.type})
                                    <br />
                                    Demandé le {new Date(req.created_at).toLocaleDateString()}
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                        statusColors[req.status] || "bg-gray-100 text-gray-800"
                                    }`}>
                                        {statusLabels[req.status] || req.status.replace('_', ' ')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* ================= MES DERNIERS PAIEMENTS ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes derniers paiements</h2>
                    <Link
                        to="/provider/payments-history" // Assurez-vous que cette route existe
                        className="text-[#155250] text-sm hover:underline"
                    >
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {payments.length === 0 ? (
                        <p>Aucun paiement pour le moment.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestPayments.map((payment) => (
                                <li key={payment.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                    <span>{new Date(payment.payment_date).toLocaleDateString()} — {payment.method}</span>
                                    <br />
                                    {/* Correction ici : Utiliser Number() pour s'assurer que payment.amount est un nombre */}
                                    <span className="font-semibold">{Number(payment.amount).toFixed(2)} €</span>
                                    <span
                                        className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                            statusColors[payment.status] || "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {statusLabels[payment.status] || payment.status.replace('_', ' ')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* ================= PARRAINAGE / ABONNEMENT (Existant) ================= */}
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
        </main>
    );
};

export default DashboardProvider;
