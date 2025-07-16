// 📁 src/pages/pro/ProviderCourses.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "@/config";

interface Ride {
    id: number;
    depart_address: string;
    arrivee_address: string;
    scheduled_date: string;
    distance_km: number;
    total_price: number;
}

const ProviderCourses = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const res = await fetch(`${API_URL}/rides/en-attente`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Erreur serveur");
                setRides(data.rides.filter((r) => r && r.total_price !== null));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#1B4F3C] mb-6">Courses disponibles</h1>
            {loading && <p>Chargement...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rides.map((ride) => (
                    <div key={ride.id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                        <p className="font-semibold">De : {ride.depart_address}</p>
                        <p>À : {ride.arrivee_address}</p>
                        <p>Date : {new Date(ride.scheduled_date).toLocaleString()}</p>
                        <p>Distance : {ride.distance_km} km</p>
                        <p className="font-bold">
                            Prix : {ride.total_price ? `${Number(ride.total_price).toFixed(2)} €` : "Non défini"}
                        </p>
                        <Link to={`/provider/courses/${ride.id}`} className="inline-block mt-4 text-sm text-white bg-[#1B4F3C] px-4 py-2 rounded hover:bg-[#154534]">
                            Voir la course
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProviderCourses;