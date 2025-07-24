import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ConfirmationTrajet = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { rideId } = location.state || {};
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <h1 className="text-3xl font-bold text-emerald-700 mb-4">
                ✅ {t("confirmationRide.success", "Course créée avec succès !")}
            </h1>
            <p className="text-gray-700 mb-6">
                {t("confirmationRide.id", "Votre identifiant de course")} : <span className="font-semibold">{rideId}</span>
            </p>
            <button
                onClick={() => navigate(`/suivi-course/${rideId}`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md transition"
            >
                {t("confirmationRide.track", "Suivre ma course")}
            </button>
        </div>
    );
};

export default ConfirmationTrajet;
