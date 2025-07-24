import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import {
    Truck, Package, CreditCard, Wallet, // Icônes pour les stats
    MapPin, ArrowRight, Calendar, Euro, // Icônes pour les trajets (DollarSign et Clock retirés car non utilisés)
    Tag, FileText, // Icônes pour les prestations
    CheckCircle, XCircle, Hourglass, // Icônes pour les paiements
    PlusCircle, // Pour les boutons d'ajout
} from "lucide-react"; // Importation d'icônes

/** -------------------------------------------------
 * Dashboard – Vue d'ensemble (provider)
 * Palette EcoDeli : #142D2D | #155250 | #E9FADF | #F1F68E
 * -------------------------------------------------*/

// Interfaces pour les données
interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    scheduled_date: string; // Gardé comme string pour la date complète
    total_price: number;
    status: string;
}

interface Request {
    id: number;
    type: string;
    title: string; // Changé de 'titre' à 'title' pour consistance si votre API utilise 'title'
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

// Labels et couleurs pour les statuts (utilisés pour les paiements et autres)
const statusLabels: Record<string, string> = {
    all: "Toutes",
    en_attente: "En attente",
    acceptee: "Acceptée",
    refusee: "Refusée",
    en_cours: "En cours",
    terminee: "Terminée",
    annulee: "Annulée",
    effectue: "Effectué", // Pour les paiements
    echeoue: "Échoué", // Pour les paiements
};

const statusColors: Record<string, string> = {
    en_cours: "bg-blue-100 text-blue-800",
    en_attente: "bg-yellow-100 text-yellow-800",
    echeoue: "bg-red-100 text-red-800",
    effectue: "bg-green-100 text-green-800",
    acceptee: "bg-blue-100 text-blue-800", // Ajouté pour les statuts de course
    refusee: "bg-red-100 text-red-800", // Ajouté pour les statuts de course
    terminee: "bg-green-100 text-green-800", // Ajouté pour les statuts de course
    annulee: "bg-gray-100 text-gray-800", // Ajouté pour les statuts de course
    default: "bg-gray-200 text-gray-700", // Pour les statuts non définis
};

// Composant Card réutilisable pour les statistiques avec icône
const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }): JSX.Element => (
    <div className="rounded-lg bg-white shadow-sm p-4 flex flex-col items-center gap-1 border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5">
        <Icon className="w-6 h-6 text-[#155250] mb-1" />
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-[#142D2D]">{value}</p>
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
        if (userContextLoading) {
            setLoading(true);
            return;
        }
        if (!user || !user.id) {
            setError("Veuillez vous connecter pour accéder au tableau de bord.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token d'authentification manquant. Veuillez vous reconnecter.");
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = user.id;

                const [ridesRes, requestsRes, paymentsRes, balanceRes] = await Promise.allSettled([
                    fetch(`${API_URL}/rides/provider/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/requests/provider/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/provider_payments/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL}/provider_payments/balance/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const processResponse = async (response: PromiseSettledResult<Response>, defaultData: any, errorMessage: string) => {
                    if (response.status === 'fulfilled' && response.value.ok) {
                        const data = await response.value.json();
                        return data;
                    } else {
                        const errorDetail = response.status === 'fulfilled' ? (await response.value.json()).message : response.reason?.message || "Erreur inconnue";
                        console.error(`[DashboardProvider] ${errorMessage}:`, errorDetail);
                        return defaultData;
                    }
                };

                const ridesData = await processResponse(ridesRes, { rides: [] }, "Erreur récupération trajets");
                const requestsData = await processResponse(requestsRes, { requests: [] }, "Erreur récupération prestations");
                const paymentsData = await processResponse(paymentsRes, { payments: [] }, "Erreur récupération paiements");
                const balanceData = await processResponse(balanceRes, { balance: 0 }, "Erreur récupération solde");


                setRides(ridesData.rides || []);
                setRequests(requestsData.requests || []);

                const processedPayments = (paymentsData.payments || []).map((payment: any) => ({
                    ...payment,
                    amount: parseFloat(payment.amount),
                    id: payment.id
                }));
                setPayments(processedPayments);

                const fetchedBalance = parseFloat(balanceData.balance);
                setBalance(isNaN(fetchedBalance) ? 0 : fetchedBalance);

                setStats({
                    trajets: ridesData.rides?.length ?? 0,
                    prestations: requestsData.requests?.length ?? 0,
                    paiements: processedPayments.length ?? 0,
                    role: user?.role ?? "-",
                });

            } catch (err: any) {
                setError("Une erreur inattendue est survenue lors du chargement du tableau de bord: " + err.message);
                console.error("[DashboardProvider] Erreur lors du fetch des données du tableau de bord:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, userContextLoading]);

    if (loading || userContextLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-lg text-gray-600">Chargement du tableau de bord prestataire...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white font-inter">
                <p className="text-lg text-red-600">Erreur : {error}</p>
            </div>
        );
    }

    // Tri et découpage des listes pour les "derniers" éléments
    const latestRides = [...rides]
        .filter(ride => ride.scheduled_date)
        .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())
        .slice(0, 3);

    const latestRequests = [...requests]
        .filter(req => req.created_at)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

    const latestPayments = [...payments]
        .filter(payment => payment.payment_date)
        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
        .slice(0, 3);

    const ongoingRides = rides.filter((r) => r.status === "en_cours");


    return (
        <main className="bg-white px-6 py-8 max-w-6xl mx-auto text-[#142D2D] font-inter min-h-[80vh] rounded-lg shadow-md mt-6">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-[#142D2D] drop-shadow-sm">
                Tableau de bord Prestataire
            </h1>

            {/* ================= SOLDE ACTUEL ================= */}
            <section className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg shadow-sm border border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8 text-green-700" />
                    <div>
                        <p className="text-base text-green-800 font-semibold">Solde actuel</p>
                        <p className="text-3xl font-bold text-green-700">
                            {balance?.toFixed(2) ?? '0.00'} €
                        </p>
                    </div>
                </div>
                <Link to="/provider/payments-history" className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1">
                    Voir l'historique des paiements <ArrowRight className="w-3 h-3" />
                </Link>
            </section>

            {/* ================= STAT CARDS ================= */}
            {stats && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    <StatCard title="Trajets" value={stats.trajets ?? 0} icon={Truck} />
                    <StatCard title="Prestations" value={stats.prestations ?? 0} icon={Package} />
                    <StatCard title="Paiements effectués" value={stats.paiements ?? 0} icon={CreditCard} />
                    <StatCard title="Rôle" value={stats.role ?? "-"} icon={FileText} />
                </section>
            )}

            {/* ================= MES TRAJETS À VENIR ================= */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#142D2D]">Mes trajets à venir</h2>
                    <Link to="/provider/courses" className="text-[#155250] text-sm hover:underline flex items-center gap-1">
                        Voir tout <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="p-5 rounded-lg bg-gray-50 shadow-sm border border-gray-200">
                    {latestRides.length === 0 ? (
                        <p className="text-gray-600 text-center py-3 text-sm">Aucun trajet planifié pour le moment.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestRides.map((ride) => (
                                <li key={ride.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-[#142D2D] flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            {ride.depart_address} <ArrowRight className="w-3 h-3 text-gray-500" /> {ride.arrivee_address}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-500" />
                                            {new Date(ride.scheduled_date).toLocaleDateString("fr-FR")}{" "}
                                            {new Date(ride.scheduled_date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <span className="text-base font-bold text-green-700">{Number(ride.total_price).toFixed(2)} €</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold uppercase ${
                                            statusColors[ride.status] || statusColors.default
                                        }`}>
                                            {statusLabels[ride.status] || ride.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* ================= TRAJETS EN COURS (Ongoing Rides) ================= */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#142D2D]">Trajets en cours</h2>
                    <Link to="/provider/courses" className="text-[#155250] text-sm hover:underline flex items-center gap-1">
                        Voir tout <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="p-5 rounded-lg bg-gray-50 shadow-sm border border-gray-200">
                    {ongoingRides.length === 0 ? (
                        <p className="text-gray-600 text-center py-3 text-sm">Aucun trajet en cours.</p>
                    ) : (
                        <ul className="space-y-3">
                            {ongoingRides.map((ride) => (
                                <li key={ride.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-[#142D2D] flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            {ride.depart_address} <ArrowRight className="w-3 h-3 text-gray-500" /> {ride.arrivee_address}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-500" />
                                            {new Date(ride.scheduled_date).toLocaleDateString("fr-FR")}{" "}
                                            {new Date(ride.scheduled_date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <span className="text-base font-bold text-green-700">{Number(ride.total_price).toFixed(2)} €</span>
                                        <Link
                                            to={`/provider/courses/${ride.id}`}
                                            className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                                        >
                                            Suivre <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* ================= MES DERNIÈRES PRESTATIONS (Requests) ================= */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#142D2D]">Mes dernières prestations</h2>
                    <Link to="/mes-prestations" className="text-[#155250] text-sm hover:underline flex items-center gap-1">
                        Voir tout <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="p-5 rounded-xl bg-gray-50 shadow-sm border border-gray-200">
                    {latestRequests.length === 0 ? (
                        <p className="text-gray-600 text-center py-3 text-sm">Aucune prestation pour le moment.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestRequests.map((req) => (
                                <li key={req.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-[#142D2D] flex items-center gap-1">
                                            <Tag className="w-4 h-4 text-emerald-600" />
                                            {req.title} ({req.type})
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-500" />
                                            Demandé le {new Date(req.created_at).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold uppercase mt-2 sm:mt-0 ${
                                        statusColors[req.status] || statusColors.default
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
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#142D2D]">Mes derniers paiements</h2>
                    <Link
                        to="/provider/payments-history"
                        className="text-[#155250] text-sm hover:underline flex items-center gap-1"
                    >
                        Voir tout <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="p-5 rounded-lg bg-gray-50 shadow-sm border border-gray-200">
                    {latestPayments.length === 0 ? (
                        <p className="text-gray-600 text-center py-3 text-sm">Aucun paiement pour le moment.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestPayments.map((payment) => (
                                <li key={payment.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-[#142D2D] flex items-center gap-1">
                                            <>
                                                {payment.status === 'effectue' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                                {payment.status === 'en_attente' && <Hourglass className="w-4 h-4 text-yellow-600" />}
                                                {payment.status === 'echeoue' && <XCircle className="w-4 h-4 text-red-600" />}
                                            </>
                                            Paiement du {new Date(payment.payment_date).toLocaleDateString("fr-FR")}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                            <CreditCard className="w-3 h-3 text-gray-500" />
                                            Méthode: {payment.method}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <span className="text-base font-bold text-green-700">{Number(payment.amount).toFixed(2)} €</span>
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full font-semibold uppercase ${
                                                statusColors[payment.status] || statusColors.default
                                            }`}
                                        >
                                            {statusLabels[payment.status] || payment.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* ================= PARRAINAGE / ABONNEMENT ================= */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                {/* Parrainage */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg flex flex-col items-start gap-3 shadow-sm border border-green-200">
                    <h3 className="font-bold text-xl text-[#155250]">Parrainage</h3>
                    <p className="text-sm text-gray-700">
                        Invitez vos proches à rejoindre EcoDeli et gagnez des crédits pour vos prochaines livraisons.
                    </p>
                    <Link
                        to="/app/parrainage"
                        className="mt-auto bg-[#155250] text-white text-sm px-5 py-2.5 rounded-lg shadow-md hover:bg-[#142D2D] transition duration-300 ease-in-out transform hover:scale-105 font-medium flex items-center gap-1.5"
                    >
                        <PlusCircle className="w-4 h-4" /> Obtenir mon lien
                    </Link>
                </div>

                {/* Abonnement */}
                <div className="bg-white p-6 rounded-lg flex flex-col items-start gap-3 shadow-sm border border-gray-200">
                    <h3 className="font-bold text-xl text-[#155250]">Abonnement actuel</h3>
                    <p className="text-sm text-gray-700">Vous êtes actuellement sur la formule <span className="font-semibold">« Free »</span>.</p>
                    <Link
                        to="/app/abonnement"
                        className="mt-auto text-[#155250] text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        Voir les offres disponibles <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default DashboardProvider;
