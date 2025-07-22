import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ------------------------------------------------------------------
 *  Dashboard Client – Home
 *  Palette  : #142D2D  #155250  #E9FADF  #F1F68E
 *  Inspirée du mock‑up envoyé (grands bandeaux, padding XL, cards)
 * ----------------------------------------------------------------*/

export default function AppHome() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="min-h-[80vh] bg-[#F9FDFB] font-outfit-regular text-[#142D2D]">
      {/* ===== Bandeau bleu clair + CTA ================================= */}
      <div className="bg-[#E9FADF] w-full px-8 lg:px-12 py-10 lg:py-13 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm">
        <div className="p-5 px-15">
          <h1 className="text-3xl lg:text-4xl font-outfit-bold font-bold mb-1">
            {t("appHome.welcome", { name: user?.firstname })}
          </h1>
          <p className="text-sm lg:text-base text-[#155250]/80">
            {t("appHome.manage_services")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            className="flex items-center gap-2 bg-[#155250] hover:bg-[#155250]/90 text-white text-lg font-medium px-6 py-4 rounded-lg shadow transition"
            onClick={() => navigate("/deposer-annonce")}
          >
            <span className="i-heroicons-plus-circle-16-solid" />
            {t("appHome.create_ad")}
          </button>
          <button className="flex items-center gap-2 bg-[#F97315] hover:bg-[#F96315] text-white text-lg font-medium px-6 py-4 rounded-lg shadow transition">
            <span className="i-heroicons-calendar-days-16-solid" />
            {t("appHome.book_service")}
          </button>
        </div>
      </div>

      {/* ===== Stat cards ============================================= */}
      <section className="max-w-8xl mx-auto px-6 lg:px-12 -mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: t("appHome.total_parcels"), value: 0 },
          { label: t("appHome.in_progress"), value: 0 },
          { label: t("appHome.delivered"), value: 0 },
          { label: t("appHome.total_spent"), value: "0 €" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-[#E9FADF] rounded-xl p-5 shadow text-center"
          >
            <p className="text-sm text-[#155250] mb-1">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      {/* ===== Aperçu activité ======================================== */}
      <section className="max-w-8xl mx-auto px-6 lg:px-12 mt-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b text-lg font-medium text-[#155250]">
            {[
              t("appHome.overview"),
              t("appHome.my_parcels"),
              t("appHome.my_orders"),
              t("appHome.my_bookings"),
              t("appHome.notifications"),
              t("appHome.payment_history"),
              t("appHome.messages"),
            ].map((tab, i) => (
              <button
                key={tab}
                className={`px-6 py-3 flex-1 text-center transition ${i === 0 ? "border-b-2 border-[#155250] bg-[#F9FDFB]" : "hover:bg-gray-50"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contenu Aperçu */}
          <div className="p-8 grid lg:grid-cols-3 gap-8 text-md text-gray-700">
            <div>
              <h3 className="font-semibold text-[#155250] mb-2">
                {t("appHome.recent_parcels")}
              </h3>
              <p className="text-gray-500">{t("appHome.no_recent_parcels")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#155250] mb-2">
                {t("appHome.bookings")}
              </h3>
              <p className="text-gray-500">{t("appHome.no_bookings")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#155250] mb-2">
                {t("appHome.notifications")}
              </h3>
              <p className="text-gray-500">{t("appHome.no_notifications")}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
