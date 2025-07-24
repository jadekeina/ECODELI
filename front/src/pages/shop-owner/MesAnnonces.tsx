import { useEffect, useState, useMemo } from "react";
import API_URL from "@/config";
import { useNavigate } from "react-router-dom";
import { Package, Euro, MapPin, Calendar, Clock, Filter } from "lucide-react";

interface Annonce {
    id: number;
    title: string;
    type: string;
    prix: string;
    statut: string;
    date_livraison: string;
    heure_livraison: string;
    description: string;
    adresse_livraison: string;
    // Si vous avez une date de création pour un tri stable en cas d'égalité de statut
    // created_at?: string;
}

const MesAnnonces = () => {
    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortOrder, setSortOrder] = useState<string>("status_priority"); // Définit le tri par priorité comme défaut
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnonces = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/shopowner-requests/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (Array.isArray(data)) {
                    setAnnonces(data);
                } else if (Array.isArray(data?.annonces)) {
                    setAnnonces(data.annonces);
                } else {
                    setError("Aucune donnée reçue.");
                }
            } catch (err) {
                console.error("Erreur :", err);
                setError("Erreur lors de la récupération des annonces.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnonces();
    }, []);

    // Fonction de tri mémorisée pour éviter les recalculs inutiles
    const sortedAnnonces = useMemo(() => {
        let sortableAnnonces = [...annonces]; // Copie pour ne pas modifier l'état original

        if (sortOrder === "status_priority") {
            sortableAnnonces.sort((a, b) => {
                const statusOrder: { [key: string]: number } = {
                    "en_attente": 1,   // Les annonces en attente sont les plus prioritaires
                    "en_cours": 2,     // Ensuite, celles en cours
                    "acceptee": 3,     // Puis celles acceptées (si distinct de en_cours)
                    "terminee": 4,     // Les terminées
                    "refusee": 5,      // Les refusées
                    "annulee": 6,      // Les annulées
                    "ignoree": 7,      // Les ignorées (moins prioritaires)
                };

                const statusA = statusOrder[a.statut] || 99; // 99 pour les statuts non définis (en fin de liste)
                const statusB = statusOrder[b.statut] || 99;

                if (statusA !== statusB) {
                    return statusA - statusB;
                }

                // Si les statuts sont identiques, trier par ID décroissant (plus récent en premier si les IDs sont croissants)
                // Ou par 'created_at' si vous l'avez dans votre interface Annonce
                return b.id - a.id;
            });
        } else if (sortOrder === "status_asc") {
            sortableAnnonces.sort((a, b) => a.statut.localeCompare(b.statut));
        } else if (sortOrder === "status_desc") {
            sortableAnnonces.sort((a, b) => b.statut.localeCompare(a.statut));
        }
        // "default" ou tout autre cas ne fait aucun tri spécifique ici,
        // les annonces restent dans l'ordre de récupération (souvent par ID ou date de création si le backend trie)

        return sortableAnnonces;
    }, [annonces, sortOrder]); // Recalcule quand 'annonces' ou 'sortOrder' changent

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-lg text-gray-600">Chargement des annonces...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-lg text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8 font-inter">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-[#1B4F3C] mb-8 text-center drop-shadow-sm">
                    📦 Mes Annonces de Livraison
                </h1>

                {annonces.length > 0 && (
                    <div className="flex justify-end mb-6">
                        <div className="relative inline-flex items-center">
                            <Filter className="absolute left-3 text-gray-400 w-5 h-5" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm bg-white cursor-pointer"
                            >
                                <option value="status_priority">Statut (Priorité)</option>
                                <option value="default">Tri par défaut</option>
                                <option value="status_asc">Statut (A-Z)</option>
                                <option value="status_desc">Statut (Z-A)</option>
                            </select>
                        </div>
                    </div>
                )}

                {annonces.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-200">
                        <p className="text-xl text-gray-600 font-medium">
                            Vous n’avez pas encore créé d’annonce.
                        </p>
                        <button
                            onClick={() => navigate("/annonces/nouvelle")}
                            className="mt-6 px-6 py-3 bg-[#1B4F3C] text-white rounded-xl shadow-md hover:bg-[#142D2D] transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Créer ma première annonce
                        </button>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sortedAnnonces.map((annonce) => (
                            <li
                                key={annonce.id}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                            >
                                <h2 className="text-2xl font-bold text-[#1B4F3C] mb-2">{annonce.title}</h2>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {annonce.description || "Pas de description."}
                                </p>

                                <div className="space-y-2 text-gray-700 text-sm">
                                    <p className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium">Type :</span> {annonce.type}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Euro className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium">Prix :</span> {annonce.prix} €
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium">Livraison :</span> {annonce.adresse_livraison}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium">Date :</span> {annonce.date_livraison?.slice(0, 10)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium">Heure :</span> {annonce.heure_livraison}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-medium">Statut :</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            annonce.statut === "en_attente" ? "bg-yellow-100 text-yellow-800" :
                                                annonce.statut === "en_cours" ? "bg-purple-100 text-purple-800" :
                                                    annonce.statut === "terminee" ? "bg-green-100 text-green-800" :
                                                        annonce.statut === "acceptee" ? "bg-blue-100 text-blue-800" : // Ajout de couleur pour 'acceptee'
                                                            annonce.statut === "refusee" ? "bg-red-100 text-red-800" : // Ajout de couleur pour 'refusee'
                                                                annonce.statut === "annulee" ? "bg-gray-400 text-white" : // Exemple de couleur pour 'annulee'
                                                                    annonce.statut === "ignoree" ? "bg-gray-200 text-gray-700" : // Exemple de couleur pour 'ignoree'
                                                                        "bg-gray-100 text-gray-800" // Couleur par défaut
                                        }`}>
                                            {annonce.statut.replace("_", " ")}
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/annonce/${annonce.id}`)}
                                        className="px-5 py-2 bg-[#1B4F3C] text-white rounded-lg shadow-md hover:bg-[#142D2D] transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Voir les détails
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MesAnnonces;
