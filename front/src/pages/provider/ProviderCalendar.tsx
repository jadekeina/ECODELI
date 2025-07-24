import { useEffect, useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import API_URL from "@/config";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Loader2, Clock, MapPin, User } from "lucide-react";

interface RequestItem {
    id: number;
    date: string;
    heure: string;
    lieu: string;
    commentaire: string;
    statut: string;
    type: string;
    firstname: string;
    lastname: string;
}

const ProviderCalendar = () => {
    const { user } = useUserContext();
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [acceptedDates, setAcceptedDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviderRequests = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!user?.token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_URL}/provider/me`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Erreur lors de la récupération du profil provider.");
                }

                const data = await res.json();
                const providerId = data.provider?.id;

                if (providerId) {
                    const response = await fetch(`${API_URL}/service_requests/provider/${providerId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(
                            errData.message || "Erreur lors de la récupération des demandes de prestations."
                        );
                    }

                    const result = await response.json();
                    setRequests(result.requests || []);

                    setAcceptedDates(
                        (result.requests || [])
                            .filter((req: RequestItem) => req.statut === "acceptee")
                            .map((req: RequestItem) => req.date.split("T")[0])
                    );
                } else {
                    setError("Aucun profil de prestataire trouvé pour cet utilisateur.");
                }
            } catch (err: any) {
                console.error("Erreur lors de la récupération des demandes :", err);
                setError(err.message || "Une erreur inattendue est survenue.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchProviderRequests();
        } else {
            setLoading(false);
            setError("Veuillez vous connecter pour voir vos demandes.");
        }
    }, [user]);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const prestationsDuJour = selectedDate
        ? requests.filter((r) => r.statut === "acceptee" && formatDate(new Date(r.date)) === formatDate(selectedDate))
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center drop-shadow-sm">
                    Mon Calendrier de Prestations
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin w-10 h-10 text-[#2C3E50]" />
                        <p className="ml-3 text-lg text-gray-600">Chargement du calendrier...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-10">
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileContent={({ date, view }) => {
                                const formatted = formatDate(date);
                                return view === "month" && acceptedDates.includes(formatted) ? (
                                    <div className="flex justify-center mt-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    </div>
                                ) : null;
                            }}
                        />

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                📅 Prestations du {selectedDate?.toLocaleDateString("fr-FR")}
                            </h2>
                            {prestationsDuJour.length === 0 ? (
                                <p className="text-gray-500">Aucune prestation acceptée ce jour.</p>
                            ) : (
                                <div className="space-y-4">
                                    {prestationsDuJour.map((req) => (
                                        <div key={req.id} className="p-4 bg-gray-50 rounded-lg shadow border">
                                            <p className="flex items-center gap-2 mb-1">
                                                <User className="w-4 h-4 text-blue-600" />
                                                <strong>{req.firstname} {req.lastname}</strong>
                                            </p>
                                            <p className="flex items-center gap-2 mb-1 text-gray-700">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                {req.heure}
                                            </p>
                                            <p className="flex items-center gap-2 mb-1 text-gray-700">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                {req.lieu}
                                            </p>
                                            {req.commentaire && (
                                                <p className="text-sm text-gray-600">{req.commentaire}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderCalendar;
