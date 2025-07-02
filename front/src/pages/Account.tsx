import { useState } from "react";
import Profil from "./Profile";
import Paiement from "./Payment";
import Securite from "./Securite";
import Document from "./Documents";
import Parrainage from "./Referral";


const Account = () => {
  const [ongletActif, setOngletActif] = useState("profil");

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
        return <Document/>;
      case "parrainage":
        return <Parrainage />;
      // case "utilisateurs":
      //   return <Utilisateurs />;
      default:
        return <div className="text-gray-500">Section en construction</div>;
    }
  };

  const tabs = [
    { key: "profil", label: "Profil" },
    { key: "securite", label: "Sécurité" },
    { key: "paiement", label: "Paiement" },
    { key: "Document", label: "Documents" },
    { key: "parrainage", label: "Parrainage" }
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Sidebar gauche */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Mon compte</h2>
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
      <main className="flex-1 p-10z">{renderContenu()}</main>
    </div>
  );
};

export default Account;
