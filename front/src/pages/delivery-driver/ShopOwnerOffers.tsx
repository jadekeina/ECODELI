import { useEffect, useState } from "react";
import API_URL from "@/config";
import { Link } from "react-router-dom";

type ShopOwnerRequest = {
    id: number;
    user_id: number;
    type: string;
    title: string;
    description: string;
    poids: number;
    longueur: number;
    largeur: number;
    hauteur: number;
    photo: string | null;
    adresse_livraison: string;
    date_livraison: string;
    heure_livraison: string;
    prix: string;
    statut: string;
    created_at: string;
    destinataire_nom: string;
    destinataire_prenom: string;
    shop_id: number | null;
};

const ShopOwnerOffers = () => {
    const [offers, setOffers] = useState<ShopOwnerRequest[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/shopowner-requests/available`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json();
                    console.error("Erreur d'autorisation :", err);
                    return [];
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setOffers(data);
                } else {
                    console.error("Données reçues invalides :", data);
                    setOffers([]);
                }
            })
            .catch((err) => {
                console.error("Erreur de récupération des offres commerçants :", err);
                setOffers([]);
            });
    }, []);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#1B4F3C] mb-6">📦 Offres commerçants disponibles</h1>

            {offers.length === 0 ? (
                <p className="text-gray-500">Aucune offre disponible pour le moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white shadow-md rounded-xl p-5 border border-gray-100">
                            <h2 className="text-lg font-semibold text-[#1B4F3C]">{offer.title}</h2>
                            <p className="text-sm text-gray-500">{offer.description}</p>

                            <div className="mt-3 space-y-1 text-sm text-gray-700">
                                <p><strong>Adresse :</strong> {offer.adresse_livraison}</p>
                                <p><strong>Heure :</strong> {offer.date_livraison.substring(0, 10)} à {offer.heure_livraison}</p>
                                <p><strong>Poids :</strong> {offer.poids} kg</p>
                                <p><strong>Dimensions :</strong> {offer.longueur} x {offer.largeur} x {offer.hauteur} cm</p>
                                <p><strong>Prix :</strong> {offer.prix} €</p>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Destinataire : {offer.destinataire_prenom} {offer.destinataire_nom}
                </span>
                                <Link
                                    to={`/livraisons/offre/${offer.id}`}
                                    className="px-4 py-2 text-sm bg-[#1B4F3C] text-white rounded hover:bg-[#16603d]"
                                >
                                    Voir
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopOwnerOffers;
