import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ConfirmationTrajet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rideId } = location.state || {};
  const { t } = useTranslation();

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700">{t("confirmationRide.title")}</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-lg font-semibold text-green-800 mb-2">{t("confirmationRide.confirmed")}</p>
        <p className="text-gray-700 mb-4">{t("confirmationRide.details")}</p>
        <ul className="space-y-2">
          <li><strong>{t("confirmationRide.departure")}:</strong> {/* valeur départ */}</li>
          <li><strong>{t("confirmationRide.arrival")}:</strong> {/* valeur arrivée */}</li>
          <li><strong>{t("confirmationRide.distance")}:</strong> {/* valeur distance */}</li>
          <li><strong>{t("confirmationRide.duration")}:</strong> {/* valeur durée */}</li>
          <li><strong>{t("confirmationRide.price")}:</strong> {/* valeur prix */}</li>
        </ul>
      </div>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded" onClick={() => window.location.href = "/app"}>
        {t("confirmationRide.back_home")}
      </button>
    </div>
  );
};

export default ConfirmationTrajet;
