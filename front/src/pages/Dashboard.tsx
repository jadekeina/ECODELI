import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/** -------------------------------------------------
 * Dashboard – Vue d'ensemble (client)
 * Palette EcoDeli : #142D2D | #155250 | #E9FADF | #F1F68E
 * -------------------------------------------------*/

interface Stats {
    trajets: number;
    prestations: number;
    role: string;
}

const Card = ({ title, value }: { title: string; value: string | number }) => (
    <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-[#E9FADF]">
        <p className="text-sm text-[#155250]">{title}</p>
        <p className="text-2xl font-semibold text-[#142D2D]">{value}</p>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios
            .get("/stats/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => setStats(r.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="px-6 py-8 max-w-6xl mx-auto text-[#142D2D] font-outfit-regular min-h-[80vh]">
            <h1 className="text-3xl font-outfit-bold mb-6">Tableau de bord</h1>

            {/* ================= STAT CARDS ================= */}
            {loading ? (
                <p>Chargement…</p>
            ) : (
                <section className="grid gap-6 sm:grid-cols-3 mb-10">
                    <Card title="Trajets" value={stats?.trajets ?? 0} />
                    <Card title="Prestations" value={stats?.prestations ?? 0} />
                    <Card title="Rôle" value={stats?.role ?? "-"} />
                </section>
            )}

            {/* ================= PROCHAINS TRAJETS ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes trajets à venir</h2>
                    <Link to="/app/mes-trajets" className="text-[#155250] text-sm hover:underline">
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {/* TODO: Map real upcoming trips */}
                    Aucun trajet planifié.
                </div>
            </section>

            {/* ================= RESERVATIONS ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes réservations</h2>
                    <Link to="/app/mes-reservations" className="text-[#155250] text-sm hover:underline">
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {/* TODO: Map real reservations */}
                    Aucune réservation en cours.
                </div>
            </section>

            {/* ================= HISTORIQUE COURT ================= */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Historique récent</h2>
                    <Link to="/app/historique" className="text-[#155250] text-sm hover:underline">
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {/* TODO: Map last 3 historic rows */}
                    Rien à afficher.
                </div>
            </section>

            {/* ================= PARRAINAGE / ABONNEMENT ================= */}
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
                        <p className="text-sm text-[#155250]">Formule « Free »</p>
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
}
