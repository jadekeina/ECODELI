// AnnoncesCardGrid.jsx
const annonces = [
  {
    id: 1,
    titre: "Livraison Paris > Lyon",
    auteur: "Jade K.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    date: "07/07/2025 10:31",
    texte: "Je cherche un livreur pour un colis volumineux à livrer sur Lyon d'ici vendredi.",
    image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg",
    status: "Active",
  },
  {
    id: 2,
    titre: "Transport urgent Paris > Massy",
    auteur: "Sandrine B.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    date: "06/07/2025 15:21",
    texte: "Colis fragile à transporter au plus vite. Rémunération à discuter.",
    image: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
    status: "En attente",
  },
  // ...etc
];

export default function AnnoncesCardGrid({ data = annonces }) {
  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-8">
      <h1 className="text-2xl font-bold text-[#155250] mb-6">Annonces déposées</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((a) => (
          <div key={a.id} className="relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-lg">
            {/* Image (carré/rectangle) */}
            <img
              src={a.image}
              alt={a.titre}
              className="w-full h-44 object-cover"
            />
            {/* Infos principales */}
            <div className="flex-1 flex flex-col p-5">
              <div className="flex items-center gap-3 mb-2">
                <img src={a.avatar} className="w-8 h-8 rounded-full" alt={a.auteur} />
                <div>
                  <div className="font-semibold text-gray-900">{a.auteur}</div>
                  <div className="text-xs text-gray-400">{a.date}</div>
                </div>
                <span className={`
                  ml-auto px-2 py-1 text-xs rounded 
                  ${a.status === "Active" ? "bg-green-100 text-green-700"
                  : a.status === "En attente" ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-500"}
                `}>
                  {a.status}
                </span>
              </div>
              <div className="font-bold text-[#155250] mb-1">{a.titre}</div>
              <div className="text-gray-700 mb-3 line-clamp-2">{a.texte}</div>
              {/* Actions */}
              <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <button className="inline-flex items-center text-xs px-3 py-1 font-medium rounded-lg text-white bg-[#155250] hover:bg-[#142D2D] transition">
                  Contacter
                </button>
                <button className="inline-flex items-center text-xs px-3 py-1 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition">
                  Modifier
                </button>
                <button className="inline-flex items-center text-xs px-3 py-1 font-medium rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
