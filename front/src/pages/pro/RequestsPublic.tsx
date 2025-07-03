import RequestCard from "@/components/requests/RequestCard";
import {useEffect, useState} from "react";
import API_URL from "@/config";


export default function RequestsPublic() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/requests/public`)
            .then((res) => res.json())
            .then((data) => setRequests(data.data || []))
            .catch((error) => console.error("Erreur lors du chargement des demandes :", error));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Toutes les annonces</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {requests.map((req) => (
                    <RequestCard key={req.id} request={req} />
                ))}
            </div>
        </div>
    );
}
