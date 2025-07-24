// front/src/pages/shop-owner/MesBoutiques.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "@/config";
import axios from "axios"; // Importation d'axios
import { PlusCircle, Store, MapPin, Loader2 } from "lucide-react"; // Importation d'icônes

interface Shop {
    id: number;
    name: string;
    address: string;
}

const MesBoutiques = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Token d'authentification manquant. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }
                const res = await axios.get<Shop[]>(`${API_URL}/shops/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setShops(res.data);
            } catch (err: any) {
                console.error("Erreur de chargement des boutiques :", err);
                setError(err.response?.data?.message || "Erreur lors du chargement de vos boutiques.");
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
                <Loader2 className="animate-spin w-10 h-10 text-[#1B4F3C]" />
                <p className="ml-3 text-lg text-gray-600">Chargement de vos boutiques...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
                <p className="text-lg text-red-500 font-medium p-4 bg-red-100 rounded-lg border border-red-200">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-[#1B4F3C] mb-8 text-center drop-shadow-sm flex items-center justify-center gap-3">
                    <Store className="w-10 h-10 text-[#1B4F3C]" /> Mes boutiques
                </h1>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => navigate("/mes-boutiques/ajouter")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4F3C] text-white rounded-xl shadow-md hover:bg-[#142D2D] transition duration-300 ease-in-out transform hover:scale-105 font-semibold text-base"
                    >
                        <PlusCircle className="w-5 h-5" /> Ajouter une boutique
                    </button>
                </div>

                {shops.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">Vous n'avez pas encore de boutiques enregistrées.</p>
                        <p className="mt-2 text-gray-600">Cliquez sur "Ajouter une boutique" pour commencer.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {shops.map((shop) => (
                            <div
                                key={shop.id}
                                onClick={() => navigate(`/mes-boutiques/${shop.id}`)}
                                className="p-6 border border-gray-100 rounded-xl shadow-lg cursor-pointer hover:bg-gray-50 transition duration-200 ease-in-out transform hover:scale-[1.01] flex items-center justify-between"
                            >
                                <div>
                                    <h2 className="font-bold text-xl text-[#155250] mb-1 flex items-center gap-2">
                                        <Store className="w-6 h-6 text-emerald-600" /> {shop.name}
                                    </h2>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-gray-500" /> {shop.address}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/mes-boutiques/edit/${shop.id}`); }}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow-sm hover:bg-blue-200 transition duration-200 font-medium text-sm"
                                >
                                    Modifier
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MesBoutiques;
