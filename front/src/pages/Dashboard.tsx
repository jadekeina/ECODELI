import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="p-6 min-h-[80vh] font-outfit-regular text-[#1B4F3C]">
            <h1 className="text-3xl font-bold mb-4">Mon compte</h1>

            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2">👤 Informations personnelles</h2>
                <p><strong>Prénom :</strong> {user?.firstname}</p>
                <p><strong>Nom :</strong> {user?.lastname}</p>
                <p><strong>Email :</strong> {user?.email}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    to="/app/mes-demandes"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-1">📦 Mes demandes</h2>
                    <p className="text-sm text-gray-600">Voir ou gérer vos demandes en cours.</p>
                </Link>

                <Link
                    to="/app/profil"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-1">📝 Modifier mon profil</h2>
                    <p className="text-sm text-gray-600">Nom, prénom, mot de passe, etc.</p>
                </Link>

                <Link
                    to="/app/moyens-de-paiement"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-1">💳 Moyens de paiement</h2>
                    <p className="text-sm text-gray-600">Cartes bancaires ou RIB à jour.</p>
                </Link>

                <Link
                    to="/app/parrainage"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-1">🎁 Parrainage</h2>
                    <p className="text-sm text-gray-600">Invitez vos proches et gagnez des avantages.</p>
                </Link>

                <Link
                    to="/app/attestations"
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-1">📃 Attestations</h2>
                    <p className="text-sm text-gray-600">Télécharger vos justificatifs.</p>
                </Link>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/connexion";
                    }}
                    className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer text-left w-full"
                >
                    <h2 className="text-lg font-semibold mb-1">🚪 Se déconnecter</h2>
                    <p className="text-sm text-gray-600">Déconnexion sécurisée de votre compte.</p>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
