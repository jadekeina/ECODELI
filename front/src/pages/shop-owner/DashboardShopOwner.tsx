import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import {
    PackagePlus, PlusCircle, FileText, Calendar,
    Tag, ArrowRight, Store
} from "lucide-react";

interface ShopOwnerRequest {
    id: number;
    title: string;
    type: string;
    created_at: string;
    status: string;
}

const statusLabels: Record<string, string> = {
    en_attente: "En attente",
    acceptee: "Acceptée",
    refusee: "Refusée",
    en_cours: "En cours",
    terminee: "Terminée",
    annulee: "Annulée",
};

const statusColors: Record<string, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    acceptee: "bg-blue-100 text-blue-800",
    refusee: "bg-red-100 text-red-800",
    en_cours: "bg-blue-100 text-blue-800",
    terminee: "bg-green-100 text-green-800",
    annulee: "bg-gray-100 text-gray-800",
    default: "bg-gray-200 text-gray-700",
};

const DashboardShopOwner = () => {
    const { user } = useContext(UserContext);
    const [requests, setRequests] = useState<ShopOwnerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/shopowner-requests/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Erreur lors de la récupération");

                const data = await res.json();
                setRequests(data);
            } catch (err: any) {
                console.error("[DashboardShopOwner] Erreur:", err.message);
                setError("Impossible de charger vos annonces.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) return <p className="text-center py-10 text-gray-500">Chargement...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

    const latestRequests = [...requests]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);

    return (
        <main className="bg-white px-6 py-8 max-w-6xl mx-auto text-[#142D2D] font-inter min-h-[80vh]">
            <h1 className="text-3xl font-extrabold mb-6 text-center drop-shadow-sm">
                Tableau de bord Commerçant
            </h1>

            {/* Nouvelle annonce rapide */}
            <section className="mb-8">
                <Link
                    to="/annonces/nouvelle"
                    className="bg-[#155250] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#103c3b] transition"
                >
                    <PlusCircle className="w-5 h-5" /> Proposer une nouvelle livraison
                </Link>
            </section>

            {/* Statistiques */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <StatCard title="Total annonces" value={requests.length} icon={PackagePlus} />
                <StatCard title="En attente" value={requests.filter(r => r.status === "en_attente").length} icon={FileText} />
                <StatCard title="En cours" value={requests.filter(r => r.status === "en_cours").length} icon={Tag} />
                <StatCard title="Terminées" value={requests.filter(r => r.status === "terminee").length} icon={Store} />
            </section>

            {/* Annonces récentes */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Mes dernières annonces</h2>
                    <Link to="/annonces/shop-owner" className="text-sm text-[#155250] hover:underline flex items-center gap-1">
                        Voir toutes mes annonces <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                    {latestRequests.length === 0 ? (
                        <p className="text-gray-500 text-center">Aucune annonce disponible.</p>
                    ) : (
                        <ul className="space-y-3">
                            {latestRequests.map((req) => (
                                <li key={req.id} className="bg-white p-3 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center border">
                                    <div>
                                        <p className="text-base font-semibold flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-emerald-600" />
                                            {req.title} ({req.type})
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-500" />
                                            {new Date(req.created_at).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 mt-2 sm:mt-0 rounded-full text-xs font-semibold uppercase ${
                                        statusColors[req.status] || statusColors.default
                                    }`}>
                                        {statusLabels[req.status] || req.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
};

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) => (
    <div className="rounded-lg bg-white shadow-sm p-4 flex flex-col items-center gap-1 border border-gray-100 hover:shadow-md transition transform hover:-translate-y-0.5">
        <Icon className="w-6 h-6 text-[#155250]" />
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-[#142D2D]">{value}</p>
    </div>
);

export default DashboardShopOwner;
