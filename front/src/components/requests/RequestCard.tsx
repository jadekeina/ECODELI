import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface RequestProps {
  request: any;
}

const RequestCard: FC<RequestProps> = ({ request }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/requests/${request.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border flex flex-col justify-between"
    >
      <img
        src={request.photo || "/default-image.jpg"}
        alt="illustration"
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1 truncate">
            {request.titre}
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Type :</strong> {request.type}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Trajet :</strong> {request.adresse_depart} ➡️{" "}
            {request.adresse_arrivee}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Prix :</strong> {request.prix} €
          </p>
          <p className="text-sm text-gray-600">
            <strong>Date :</strong>{" "}
            {new Date(request.date_demande).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // ne pas déclencher la navigation de la carte
            navigate(`/requests/${request.id}`);
          }}
          className="mt-4 border border-emerald-700 text-emerald-700 font-medium text-sm py-2 px-3 rounded hover:bg-emerald-700 hover:text-white transition"
        >
          Voir l’annonce
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
