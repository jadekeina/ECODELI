import { useState } from "react";

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

interface Props {
  data: Annonce[];
  onDelete: (id: number) => Promise<void>;
  onRefresh: () => Promise<void>;
}

// Fonction utilitaire pour formater les types
const formatType = (type: string) => {
  const types: { [key: string]: string } = {
    'colis_total': 'Colis complet',
    'colis_partiel': 'Colis partiel',
    'livraison_domicile': 'Livraison à domicile',
    'transport_personne': 'Transport de personne',
    'courses': 'Courses',
    'achat_etranger': 'Achat à l\'étranger',
    'service_domicile': 'Service à domicile',
    'box_stockage': 'Box de stockage'
  };
  return types[type] || type;
};

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function AnnoncesCardGrid({ data, onDelete, onRefresh }: Props) {
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setIsModalOpen(true);
  };

  const handleContactUser = (annonce: Annonce) => {
    window.open(`mailto:${annonce.mail}?subject=Concernant votre annonce: ${annonce.titre}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnonce(null);
  };

  return (
      <>
        <div className="w-full min-h-screen bg-gray-50 py-8 px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#155250]">
              Annonces déposées ({data.length})
            </h1>
            <button
                onClick={onRefresh}
                className="px-4 py-2 bg-[#155250] text-white rounded-lg hover:bg-[#142D2D] transition"
            >
              Actualiser
            </button>
          </div>

          {data.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucune annonce trouvée</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((annonce) => (
                    <div key={annonce.id} className="relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-lg">
                      {/* Image */}
                      <img
                          src={annonce.photo || "/storage/default-images/requests.webp"}
                          alt={annonce.titre}
                          className="w-full h-44 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/storage/default-images/requests.webp";
                          }}
                      />

                      {/* Infos principales */}
                      <div className="flex-1 flex flex-col p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                              src={annonce.profilpicture || "/storage/default-images/default.jpg"}
                              className="w-8 h-8 rounded-full object-cover"
                              alt={`${annonce.firstname} ${annonce.lastname}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/storage/default-images/default.jpg";
                              }}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {annonce.firstname} {annonce.lastname}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(annonce.created_at)}
                            </div>
                          </div>
                          <span className="ml-auto px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {formatType(annonce.type)}
                    </span>
                        </div>

                        <div className="font-bold text-[#155250] mb-1">{annonce.titre}</div>
                        <div className="text-gray-700 mb-3 line-clamp-2">
                          {annonce.description || "Aucune description"}
                        </div>

                        {/* Infos supplémentaires */}
                        <div className="text-xs text-gray-500 mb-3">
                          {annonce.prix && <div>Prix: {annonce.prix}€</div>}
                          {annonce.budget && <div>Budget: {annonce.budget}€</div>}
                          {annonce.adresse_depart && annonce.adresse_arrivee && (
                              <div>{annonce.adresse_depart} → {annonce.adresse_arrivee}</div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                          <button
                              onClick={() => handleViewDetails(annonce)}
                              className="inline-flex items-center text-xs px-3 py-1 font-medium rounded-lg text-white bg-[#155250] hover:bg-[#142D2D] transition"
                          >
                            Voir détails
                          </button>
                          <button
                              onClick={() => handleContactUser(annonce)}
                              className="inline-flex items-center text-xs px-3 py-1 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
                          >
                            Contacter
                          </button>
                          <button
                              onClick={() => onDelete(annonce.id)}
                              className="inline-flex items-center text-xs px-3 py-1 font-medium rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Modal de détails */}
        {isModalOpen && selectedAnnonce && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-[#155250]">{selectedAnnonce.titre}</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Image */}
                  {selectedAnnonce.photo && (
                      <img
                          src={selectedAnnonce.photo}
                          alt={selectedAnnonce.titre}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                  )}

                  {/* Informations utilisateur */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Informations client</h3>
                    <div className="flex items-center gap-3">
                      <img
                          src={selectedAnnonce.profilpicture || "/storage/default-images/default.jpg"}
                          className="w-12 h-12 rounded-full object-cover"
                          alt={`${selectedAnnonce.firstname} ${selectedAnnonce.lastname}`}
                      />
                      <div>
                        <div className="font-medium">{selectedAnnonce.firstname} {selectedAnnonce.lastname}</div>
                        <div className="text-sm text-gray-600">{selectedAnnonce.mail}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedAnnonce.description || "Aucune description"}</p>
                  </div>

                  {/* Détails techniques */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold mb-2">Type</h3>
                      <p className="text-gray-700">{formatType(selectedAnnonce.type)}</p>
                    </div>

                    {selectedAnnonce.prix && (
                        <div>
                          <h3 className="font-semibold mb-2">Prix</h3>
                          <p className="text-gray-700">{selectedAnnonce.prix}€</p>
                        </div>
                    )}

                    {selectedAnnonce.budget && (
                        <div>
                          <h3 className="font-semibold mb-2">Budget</h3>
                          <p className="text-gray-700">{selectedAnnonce.budget}€</p>
                        </div>
                    )}

                    {selectedAnnonce.poids && (
                        <div>
                          <h3 className="font-semibold mb-2">Poids</h3>
                          <p className="text-gray-700">{selectedAnnonce.poids} kg</p>
                        </div>
                    )}
                  </div>

                  {/* Adresses */}
                  {(selectedAnnonce.adresse_depart || selectedAnnonce.adresse_arrivee) && (
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Adresses</h3>
                        {selectedAnnonce.adresse_depart && (
                            <p className="text-gray-700"><strong>Départ:</strong> {selectedAnnonce.adresse_depart}</p>
                        )}
                        {selectedAnnonce.adresse_arrivee && (
                            <p className="text-gray-700"><strong>Arrivée:</strong> {selectedAnnonce.adresse_arrivee}</p>
                        )}
                      </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={() => handleContactUser(selectedAnnonce)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Contacter le client
                    </button>
                    <button
                        onClick={() => {
                          onDelete(selectedAnnonce.id);
                          closeModal();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Supprimer l'annonce
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
}