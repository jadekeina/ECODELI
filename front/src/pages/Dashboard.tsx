import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  

    return (
        <div className="p-6 flex items-center flex-col min-h-[80vh] font-outfit-regular text-[#1B4F3C]">
            <h1 className="flex self-center text-3xl font-outfit-bold mb-4">Tableau de bord</h1>

       

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    to="/app/mes-demandes"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-outfit-regular mb-1">📦 Mes demandes</h2>
                    <p className="text-sm text-gray-600 font-outfit-regular">Voir ou gérer vos demandes en cours.</p>
                </Link>

                <Link
                    to="/app/profil"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-outfit-regular mb-1">📝 Modifier mon profil</h2>
                    <p className="text-sm text-gray-600 font-outfit-regular">Nom, prénom, mot de passe, etc.</p>
                </Link>

                <Link
                    to="/app/moyens-de-paiement"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-outfit-regular mb-1">💳 Moyens de paiement</h2>
                    <p className="text-sm text-gray-600 font-outfit-regular">Cartes bancaires ou RIB à jour.</p>
                </Link>

                <Link
                    to="/app/parrainage"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-outfit-regular mb-1">🎁 Parrainage</h2>
                    <p className="text-sm text-gray-600 font-outfit-regular">Invitez vos proches et gagnez des avantages.</p>
                </Link>

                <Link
                    to="/app/attestations"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-outfit-regular mb-1">📃 Attestations</h2>
                    <p className="text-sm text-gray-600 font-outfit-regular">Télécharger vos justificatifs.</p>
                </Link>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/connexion";
                    }}
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer text-left w-full"
                >
                    <h2 className="text-lg font-outfit-regular mb-1">🚪 Se déconnecter</h2>
                    <p className="text-sm text-gray-600 font-outfit-regular">Déconnexion sécurisée de votre compte.</p>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
