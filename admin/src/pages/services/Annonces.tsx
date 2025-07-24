import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../config";
import AnnoncesCardGrid from "../../components/Graph/AnnoncesCardGrid";

interface Annonce {
  id: number;
  titre: string;
  description: string;
  photo?: string;
  type: string;
  longueur?: number;
  largeur?: number;
  poids?: number;
  prix?: number;
  prix_suggere?: number;
  heure_depart?: string;
  heure_arrivee?: string;
  budget?: number;
  tarif_prestataire?: number;
  taille_box?: string;
  duree?: string;
  adresse_depart?: string;
  adresse_arrivee?: string;
  date_demande?: string;
  created_at: string;
  firstname: string;
  lastname: string;
  mail: string;
  profilpicture?: string;
  user_id: number;
}

export default function Annonces() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnonces = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Chargement des annonces admin...");

      // Test temporaire avec la route publique
      console.log("🌐 URL appelée:", `${API_URL}/requests/public`);

      const response = await axios.get(`${API_URL}/requests/public`);

      console.log("📥 Réponse complète:", response);
      console.log("📊 Status:", response.status);
      console.log("📋 Data reçue:", response.data);

      const annoncesArray = Array.isArray(response.data) ? response.data : response.data.data || [];
      console.log("🎯 Annonces array final:", annoncesArray);
      console.log("📊 Nombre d'annonces:", annoncesArray.length);

      setAnnonces(annoncesArray);

    } catch (err) {
      console.error("❌ Erreur complète:", err);
      console.error("❌ Response error:", err.response?.data);
      console.error("❌ Status:", err.response?.status);
      setError(`Erreur: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      setAnnonces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnonce = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("✅ Annonce supprimée:", id);

      // Recharger la liste
      await fetchAnnonces();

    } catch (err) {
      console.error("❌ Erreur suppression:", err);
      alert("Erreur lors de la suppression de l'annonce");
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  if (loading) {
    return (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-8 flex items-center justify-center">
          <div className="text-lg text-gray-600">Chargement des annonces...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-8 flex items-center justify-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
    );
  }

  return (
      <AnnoncesCardGrid
          data={annonces}
          onDelete={handleDeleteAnnonce}
          onRefresh={fetchAnnonces}
      />
  );
}