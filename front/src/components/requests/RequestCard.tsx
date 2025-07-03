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
            className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border"
        >
            <img
                src={request.photo || "/default-image.jpg"}
                alt="illustration"
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-1 truncate">{request.titre}</h2>
                <p className="text-sm text-gray-600">
                    <strong>Type :</strong> {request.type}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Trajet :</strong> {request.adresse_depart} ➡️ {request.adresse_arrivee}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Prix :</strong> {request.prix} €
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Date :</strong>{" "}
                    {new Date(request.date_demande).toLocaleDateString("fr-FR")}
                </p>
            </div>
        </div>
    );
};

export default RequestCard;
