import PrestationsCardsGrid from "../components/ui/PrestationsCardGrid";
import AnnoncesCardGrid from "../components/ui/AnnoncesCardGrid";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AccueilClient() {
  const { t } = useTranslation();

  // Données fictives de prestations pour l'exemple (à remplacer par un vrai fetch API si besoin)
  const prestations = [
    {
      id: 1,
      titre: "Cours de yoga à domicile",
      client: "Jade K.",
      avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
      date: "19/07/2025",
      montant: "25 €",
      type: "Service",
      status: "Disponible",
      image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
    },
    {
      id: 2,
      titre: "Baby-sitting soirée",
      client: "Nathan B.",
      avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
      date: "20/07/2025",
      montant: "40 €",
      type: "Service",
      status: "Disponible",
      image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
    },
  ];

  const handleContact = (item) => alert(`Contacter ${item.client}`);
  const handleVoirDetail = (item) => alert(`Voir détail de "${item.titre}"`);
  const handleCancel = (item) => alert(`Annuler "${item.titre}"`);

  return (
    <div className="bg-gray-50 min-h-screen">

      <main className="max-w-[100em] mx-auto px-4 py-10">
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1B4F3C]">
              {t("accueilClient.latest_ads")}
            </h2>
            <Link
              to="/deposer-annonce"
              className="text-sm bg-[#1B4F3C] text-white px-4 py-2 rounded hover:bg-[#155250]"
            >
              {t("accueilClient.post_ad")}
            </Link>
          </div>
          <AnnoncesCardGrid />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#1B4F3C] mb-6">
            {t("accueilClient.latest_services")}
          </h2>
          <PrestationsCardsGrid
            data={prestations}
            onContact={handleContact}
            onVoirDetail={handleVoirDetail}
            onCancel={handleCancel}
          />
        </section>
      </main>
    </div>
  );
}
