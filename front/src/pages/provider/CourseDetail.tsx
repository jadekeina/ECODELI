import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "@/config";
import { useUserContext } from "@/contexts/UserContext";

interface Ride {
    id: number;
    status: string;
    depart_address: string;
    arrivee_address: string;
    scheduled_date?: string;
    total_price?: number | string | null;
    note?: string;
    provider_id?: number | null; // ID du prestataire (de la table 'provider')
    user_id: number; // ID du client (de la table 'users') qui a créé la course
}

const statusLabels: Record<string, string> = {
    en_attente: "En attente",
    acceptee: "Acceptée",
    refusee: "Refusée",
    en_cours: "En cours",
    terminee: "Terminée",
    annulee: "Annulée",
};

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: userContextLoading } = useUserContext();
    console.log("[CourseDetail - Init] id from params:", id, "user:", user, "userContextLoading:", userContextLoading);

    const [ride, setRide] = useState<Ride | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        console.log("[CourseDetail - useEffect] Début de l'effet.");
        if (userContextLoading) {
            console.log("[CourseDetail - useEffect] UserContext en cours de chargement, attente...");
            return;
        }
        if (!id || !user || !user.id) {
            console.warn("[CourseDetail - useEffect] ID de course ou utilisateur manquant. Arrêt du fetch.");
            setLoading(false);
            return;
        }

        const fetchRide = async () => {
            const token = localStorage.getItem("token");
            console.log("[CourseDetail - fetchRide] Token du localStorage:", token ? "Présent" : "Absent");
            console.log("[CourseDetail - fetchRide] API_URL:", API_URL);
            console.log("[CourseDetail - fetchRide] Requête pour la course ID:", id);

            try {
                const url = `${API_URL}/rides/get/${id}`;
                console.log("[CourseDetail - fetchRide] Requête API vers:", url);

                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("[CourseDetail - fetchRide] Réponse API (res.ok, status):", res.ok, res.status);

                const data = await res.json();
                console.log("[CourseDetail - fetchRide] Données JSON reçues:", data);

                if (!res.ok) {
                    const errorMessage = data.message || `Erreur serveur: ${res.status}`;
                    console.error("[CourseDetail - fetchRide] Erreur HTTP:", errorMessage);
                    throw new Error(errorMessage);
                }

                if (data.ride) {
                    const fetchedRide: Ride = {
                        ...data.ride,
                        total_price: typeof data.ride.total_price === 'string'
                            ? parseFloat(data.ride.total_price)
                            : data.ride.total_price
                    };
                    console.log("[CourseDetail - fetchRide] Course récupérée et traitée:", fetchedRide);
                    setRide(fetchedRide);
                } else {
                    console.warn("[CourseDetail - fetchRide] La clé 'ride' est absente de la réponse.");
                    setError("Détails de la course introuvables.");
                }

            } catch (err: any) {
                console.error("[CourseDetail - fetchRide] Erreur lors du fetch de la course:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
                console.log("[CourseDetail - fetchRide] Fin du fetch. loading est false.");
            }
        };

        fetchRide();
    }, [id, user, userContextLoading]);

    const updateStatus = async (newStatus: string) => {
        console.log(`[CourseDetail - updateStatus] Tentative de mise à jour du statut vers: ${newStatus}`);
        if (!ride) {
            console.warn("[CourseDetail - updateStatus] Pas de course à mettre à jour.");
            return;
        }
        setUpdating(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const url = `${API_URL}/rides/${ride.id}/status`;
            console.log(`[CourseDetail - updateStatus] Requête PATCH vers: ${url} avec statut: ${newStatus}`);

            let bodyData: { status: string; provider_user_id?: number } = { status: newStatus };

            // Logique spécifique pour l'acceptation de la course
            if (newStatus === "acceptee") {
                if (!user || !user.id) {
                    throw new Error("Impossible d'accepter la course : ID utilisateur du prestataire non disponible.");
                }
                bodyData.provider_user_id = user.id; // Le backend mappera cet user.id au provider_id
                console.log("[CourseDetail - updateStatus] Statut 'acceptee', ajout de provider_user_id:", user.id);
            }

            const res = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            console.log("[CourseDetail - updateStatus] Réponse API (res.ok, status):", res.ok, res.status);
            const data = await res.json();
            console.log("[CourseDetail - updateStatus] Données JSON de mise à jour reçues:", data);

            if (!res.ok) {
                const errorMessage = data.message || `Erreur serveur lors de la mise à jour: ${res.status}`;
                console.error("[CourseDetail - updateStatus] Erreur HTTP lors de la mise à jour:", errorMessage);
                throw new Error(errorMessage);
            }

            // Mettre à jour l'état local de la course
            setRide(prevRide => {
                if (!prevRide) return null;
                const updatedRide = { ...prevRide, status: newStatus };
                // Si la course est acceptée, et que l'API ne renvoie pas le provider_id,
                // on peut le mettre à jour localement pour que les boutons s'adaptent.
                // Idéalement, l'API renverrait le ride complet mis à jour.
                if (newStatus === "acceptee" && user?.id) {
                    // C'est une approximation, car ride.provider_id est l'ID de la table 'provider',
                    // et user.id est l'ID de la table 'users'. Le backend doit faire le lien.
                    // Si votre API renvoie l'objet 'ride' complet avec le 'provider_id' après la mise à jour,
                    // il serait préférable de faire setRide(data.updatedRide);
                    console.warn("[CourseDetail - updateStatus] Attribution locale de provider_id basée sur user.id. Vérifiez que l'API renvoie le provider_id réel pour une meilleure synchronisation.");
                }
                return updatedRide;
            });
            console.log("[CourseDetail - updateStatus] Statut mis à jour avec succès localement.");

        } catch (err: any) {
            console.error("[CourseDetail - updateStatus] Erreur mise à jour :", err.message);
            setError("Erreur lors de la mise à jour du statut : " + err.message);
        } finally {
            setUpdating(false);
            console.log("[CourseDetail - updateStatus] Fin de la mise à jour. updating est false.");
        }
    };

    console.log("[CourseDetail - Render] État actuel:", { loading, error, ride, updating });

    if (loading) return <p className="p-6">Chargement...</p>;
    if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;
    if (!ride) return <p className="p-6 text-gray-500">Course introuvable.</p>;

    // Vérifier si l'utilisateur est le client qui a créé la course
    const isClientOfThisRide = user?.id === ride.user_id;

    // Déterminer si le prestataire connecté est le prestataire attribué à cette course.
    // Cela nécessite que l'API renvoie le provider_id dans l'objet 'ride'
    // ET que le 'user' du contexte contienne l'ID du prestataire (provider.id)
    // correspondant à son user.id.
    // Pour l'instant, on va juste vérifier si le ride a un provider_id non null
    // et que l'utilisateur est un prestataire.
    const isProviderAssignedToThisRide = user?.role === 'provider' && ride.provider_id !== null;
    // NOTE IMPORTANTE: La ligne ci-dessus est une simplification.
    // Pour une vérification stricte, il faudrait que le `user` du contexte ait un `providerId`
    // et que `user.providerId === ride.provider_id`.

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
            <h1 className="text-2xl font-bold text-[#1B4F3C]">Détail de la course</h1>
            <p><strong>Départ :</strong> {ride.depart_address}</p>
            <p><strong>Arrivée :</strong> {ride.arrivee_address}</p>
            <p><strong>Date prévue :</strong> {ride.scheduled_date ? new Date(ride.scheduled_date).toLocaleString() : "Non définie"}</p>
            <p>
                <strong>Prix :</strong>{" "}
                {typeof ride.total_price === 'number' && !isNaN(ride.total_price)
                    ? `${ride.total_price.toFixed(2)} €`
                    : "Non défini"}
            </p>
            <p><strong>Note :</strong> {ride.note || "Aucune"}</p>
            <p><strong>Statut actuel :</strong> <span className="capitalize">{statusLabels[ride.status]}</span></p>
            {ride.provider_id && <p><strong>Prestataire attribué ID :</strong> {ride.provider_id}</p>}


            <div className="flex space-x-4">
                {/* Boutons pour les prestataires sur les courses en attente d'acceptation */}
                {ride.status === "en_attente" && user?.role === 'provider' && (
                    <>
                        <button
                            disabled={updating}
                            onClick={() => updateStatus("acceptee")}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            Accepter
                        </button>
                        <button
                            disabled={updating}
                            onClick={() => updateStatus("refusee")}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            Refuser
                        </button>
                    </>
                )}

                {/* Boutons pour le prestataire ATTRIBUÉ (ou après acceptation) */}
                {/* Ces boutons ne s'affichent que si la course est acceptée ou en cours ET qu'il y a un prestataire attribué (même si ce n'est pas forcément l'actuel utilisateur) */}
                { (ride.status === "acceptee" || ride.status === "en_cours") && user?.role === 'provider' && isProviderAssignedToThisRide && (
                    <>
                        {ride.status === "acceptee" && (
                            <button
                                disabled={updating}
                                onClick={() => updateStatus("en_cours")}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                Marquer en cours
                            </button>
                        )}
                        {ride.status === "en_cours" && (
                            <button
                                disabled={updating}
                                onClick={() => updateStatus("terminee")}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                            >
                                Marquer terminée
                            </button>
                        )}
                        {/* Le bouton annuler est disponible pour les courses en cours ou acceptées par le prestataire */}
                        <button
                            disabled={updating}
                            onClick={() => updateStatus("annulee")}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            Annuler
                        </button>
                    </>
                )}

                {/* Bouton pour le CLIENT pour annuler SA PROPRE demande en attente */}
                {/* Ce bouton ne doit PAS être visible pour un prestataire, même s'il est aussi le client de cette course */}
                {isClientOfThisRide && ride.status === "en_attente" && user?.role !== 'provider' && (
                    <button
                        disabled={updating}
                        onClick={() => updateStatus("annulee")}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        Annuler ma demande
                    </button>
                )}

                {/* Afficher un message ou rien si c'est une course refusée ou terminée */}
                {ride.status === "refusee" && <p className="text-red-500">Cette course a été refusée.</p>}
                {ride.status === "terminee" && <p className="text-green-500">Cette course est terminée.</p>}
            </div>
        </div>
    );
}
