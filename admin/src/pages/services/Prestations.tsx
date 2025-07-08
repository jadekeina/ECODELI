import PrestationsCardsGrid from "../../components/Graph/PrestationsCardGrid";

export default function PrestationsPage() {
  const prestations = [
    {
      id: 1,
      titre: "Livraison de colis urgent",
      client: "Fatou D.",
      avatar: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
      date: "06/07/2025",
      montant: "40 €",
      type: "Livraison",
      status: "Validée",
      image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
    },
    {
      id: 2,
      titre: "Prestation - Montage meuble",
      client: "Ali B.",
      avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
      date: "07/07/2025",
      montant: "50 €",
      type: "Prestation",
      status: "En attente",
      image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg",
    },
    {
      id: 3,
      titre: "Livraison Paris > Massy",
      client: "Sandrine B.",
      avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
      date: "07/07/2025",
      montant: "12 €",
      type: "Livraison",
      status: "En cours",
      image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg",
    },
  ];

  const handleContact = (presta) => alert(`Contacter ${presta.client}`);
  const handleVoirDetail = (presta) => alert(`Voir détail de "${presta.titre}"`);
  const handleCancel = (presta) => alert(`Annuler "${presta.titre}"`);

  return (
    <PrestationsCardsGrid
      data={prestations}
      onContact={handleContact}
      onVoirDetail={handleVoirDetail}
      onCancel={handleCancel}
    />
  );
}
