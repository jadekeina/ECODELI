import { useState } from "react";
import Profil from "./Profile";
import Paiement from "./Payment";
import Securite from "./Securite";
import Document from "./Documents";
import Parrainage from "./Referral";
import { useTranslation } from "react-i18next";

const Account = () => {
  const [ongletActif, setOngletActif] = useState("profil");
  const { t } = useTranslation();

  const renderContenu = () => {
    switch (ongletActif) {
      case "profil":
        return <Profil />;
      case "paiement":
        return <Paiement />;
      // case "entreprise":
      //   return <Entreprise />;
      case "securite":
        return <Securite />;
      case "Document":
        return <Document />;
      case "parrainage":
        return <Parrainage />;
      // case "utilisateurs":
      //   return <Utilisateurs />;
      default:
        return null; // No default content for now
    }
  };

  const tabs = [
    { key: "profil", label: t("account.profile") },
    { key: "securite", label: t("account.security") },
    { key: "paiement", label: t("account.payment") },
    { key: "Document", label: t("account.documents") },
    { key: "parrainage", label: t("account.referral") }
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Sidebar gauche */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">{t("account.my_account")}</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setOngletActif(tab.key)}
              className={`w-full text-left px-4 py-2 rounded-md transition-all ${
                ongletActif === tab.key
                  ? "bg-[#E9FADF] text-[#155250] font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-10z">
        {renderContenu() || <div className="text-gray-500">{t("account.under_construction")}</div>}
      </main>
    </div>
  );
};

export default Account;
