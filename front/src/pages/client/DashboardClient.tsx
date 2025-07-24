// front/src/components/DashboardClient.tsx
import {JSX, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";

interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    scheduled_date?: string;
    total_price?: number | string; // Allow string for total_price to be safe, then parse
    status: string;
}

interface Stats {
    trajets: number;
    prestations?: number;
    role?: string;
}

export default function DashboardClient() {
    // Récupère l'utilisateur et l'état de chargement du contexte global
    // Note: Le token est maintenant récupéré directement du localStorage dans ce composant.
    const { user, loading: userContextLoading } = useUserContext();
    const [stats, setStats] = useState<Stats | null>(null);
    const [rides, setRides] = useState<Ride[]>([]); // Tous les trajets récupérés du backend
    const [loading, setLoading] = useState(true); // État de chargement pour le DashboardClient

    useEffect(() => {
        // Récupère le token directement du localStorage comme spécifié par le client
        const token = localStorage.getItem("token");

        // Gère les états de chargement et l'absence de token
        if (userContextLoading || !token) {
            if (!token) {
                console.warn("[DashboardClient] Pas de token trouvé, fetch annulé."); //
            } else {
                console.info("[DashboardClient] UserContext en cours de chargement, attente...");
            }
            setLoading(false);
            return;
        }

        console.log("[DashboardClient] Token trouvé :", token); //

        // Appel à l'API pour récupérer les trajets du client
        fetch(`${API_URL}/rides/client/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des trajets");
                }
                return response.json(); // Parse la réponse JSON
            })
            .then((data) => {
                // Les données reçues sont maintenant correctement structurées (message et rides)
                console.log("[DashboardClient] Données reçues :", data); //
                console.log("[DashboardClient] Contenu de data.rides :", data.rides); //

                setRides(data.rides || []); // Met à jour l'état 'rides' avec le tableau de trajets

                setStats((prev) => ({
                    ...prev,
                    trajets: data.rides?.length ?? 0, // Met à jour le nombre total de trajets
                    role: user?.role ?? "-",
                    prestations: prev?.prestations ?? 0,
                }));
            })
            .catch((error) => {
                console.error("Erreur fetch trajets client:", error);
                setStats(null);
            })
            .finally(() => setLoading(false));
    }, [user, userContextLoading]); // Les dépendances incluent 'user' (pour le rôle) et 'userContextLoading'

    // Filtrer et trier les trajets pour l'affichage
    // Pour "Mes trajets", les 3 derniers trajets (peu importe le statut)
    const allClientRides = [...rides].sort((a, b) => {
        const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
        const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
        return dateB - dateA; // Trie par date décroissante
    });
    const lastThreeRides = allClientRides.slice(0, 3); // Les 3 derniers trajets

    // Pour "Trajets à suivre", seulement ceux 'en_cours'
    const ongoingRides = rides.filter((r) => r.status === "en_cours");

    return (
        <main className="px-6 py-8 max-w-6xl mx-auto text-[#142D2D] font-outfit-regular min-h-[80vh]">
            <h1 className="text-3xl font-outfit-bold mb-6">Tableau de bord</h1>

            {/* STAT CARDS */}
            {loading || userContextLoading ? (
                <p>Chargement…</p>
            ) : (
                <section className="grid gap-6 sm:grid-cols-3 mb-10">
                    <Card title="Trajets" value={stats?.trajets ?? 0} /> {/* Should now display correct number */}
                    <Card title="Prestations" value={stats?.prestations ?? 0} />
                    <Card title="Rôle" value={stats?.role ?? "-"} />
                </section>
            )}

            {/* MES TRAJETS - Affiche les 3 derniers trajets (peu importe le statut) */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes trajets</h2>
                    <Link
                        to="/app/mes-trajets"
                        className="text-[#155250] text-sm hover:underline"
                    >
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {lastThreeRides.length === 0 ? (
                        <p>Aucun trajet planifié.</p>
                    ) : (
                        <ul className="space-y-3">
                            {lastThreeRides.map((ride) => {
                                // Safe parsing of total_price
                                const price = typeof ride.total_price === 'string'
                                    ? parseFloat(ride.total_price)
                                    : ride.total_price;

                                return (
                                    <li key={ride.id} className="border-b border-gray-200 pb-2">
                                        <strong>{ride.depart_address}</strong> →{" "}
                                        <strong>{ride.arrivee_address}</strong>
                                        <br />
                                        {/* Affiche la date formatée ou "Date non définie" */}
                                        {ride.scheduled_date
                                            ? new Date(ride.scheduled_date).toLocaleString()
                                            : "Date non définie"}{" "}
                                        -{" "}
                                        {/* Affiche le prix formaté ou "Prix non défini" */}
                                        {price !== undefined && price !== null && !isNaN(price)
                                            ? `${price.toFixed(2)} €`
                                            : "Prix non défini"}
                                        {/* Affichage du statut avec style conditionnel */}
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                                            ride.status === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                                                ride.status === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800' // Pour les autres statuts
                                        }`}>
                                            {ride.status.replace('_', ' ')}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </section>

            {/* TRAJETS À SUIVRE - Seulement les trajets "en_cours" */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Trajets à suivre</h2>
                    <Link
                        to="/app/suivi-course"
                        className="text-[#155250] text-sm hover:underline"
                    >
                        Voir tout ➜
                    </Link>
                </div>
                <div className="p-4 rounded-lg bg-white shadow text-sm text-gray-600">
                    {ongoingRides.length === 0 ? (
                        <p>Aucun trajet en cours.</p>
                    ) : (
                        <ul className="space-y-3">
                            {ongoingRides.map((ride) => {
                                // Safe parsing of total_price
                                const price = typeof ride.total_price === 'string'
                                    ? parseFloat(ride.total_price)
                                    : ride.total_price;

                                return (
                                    <li key={ride.id} className="border-b border-gray-200 pb-2">
                                        <strong>{ride.depart_address}</strong> →{" "}
                                        <strong>{ride.arrivee_address}</strong>
                                        <br />
                                        {ride.scheduled_date
                                            ? new Date(ride.scheduled_date).toLocaleString()
                                            : "Date non définie"}{" "}
                                        -{" "}
                                        {price !== undefined && price !== null && !isNaN(price)
                                            ? `${price.toFixed(2)} €`
                                            : "Prix non défini"}{" "}
                                        <br />
                                        <Link
                                            to={`/suivi-course/${ride.id}`}
                                            className="text-sm text-emerald-700 hover:underline"
                                        >
                                            Suivre la course
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
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
}

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