import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "@/config";

const AnnonceDetailPro = () => {
    const { id } = useParams();
    const [annonce, setAnnonce] = useState<any>(null);

    useEffect(() => {
        // À remplacer par ton vrai endpoint API
        fetch(`${API_URL}/requests/public/${id}`)
            .then((res) => res.json())
            .then((data) => setAnnonce(data))
            .catch((err) => console.error("Erreur chargement annonce:", err));
    }, [id]);

    if (!annonce) return <div className="p-4">Chargement...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Détail de l'annonce</h1>

            <img
                src={annonce.photo || "/default-image.jpg"}
                alt="illustration"
                className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">{annonce.titre}</h2>
                <p><strong>Type :</strong> {annonce.type}</p>
                <p><strong>Description :</strong> {annonce.description}</p>
                <p><strong>Trajet :</strong> {annonce.adresse_depart} ➡️ {annonce.adresse_arrivee}</p>
                <p><strong>Prix :</strong> {annonce.prix} €</p>
                <p><strong>Poids :</strong> {annonce.poids} kg</p>
                <p><strong>Dimensions :</strong> {annonce.longueur} x {annonce.largeur} cm</p>
                <p><strong>Date demandée :</strong> {new Date(annonce.date_demande).toLocaleDateString("fr-FR")}</p>
                {/* Zone des entrepôts si livraison partielle */}
                {annonce.type === "colis_partiel" && annonce.entrepots && (
                    <div className="mt-4">
                        <strong>Entrepôts intermédiaires :</strong>
                        <ul className="list-disc list-inside">
                            {annonce.entrepots.map((e: string, i: number) => (
                                <li key={i}>{e}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex gap-4 mt-6">
                <button className="px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50">
                    Refuser
                </button>
                <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
                    Accepter la mission
                </button>
            </div>
        </div>
    );
};

export default AnnonceDetailPro;
