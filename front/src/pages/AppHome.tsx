import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const AppHome = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="px-6 py-10 text-[#1B4F3C] font-outfit-regular min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-4">Bonjour {user?.firstname} 👋</h1>


            <p className="text-lg mb-6">
                Bienvenue sur votre espace personnel EcoDeli.
                <br />
                Retrouvez ici tous vos services, vos demandes, et vos infos personnelles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">📦 Créer une demande</h2>
                    <p className="text-sm text-gray-600">Besoin d’un service ? Publiez une demande en un clic.</p>
                </div>

                <div className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">🗂️ Mes demandes</h2>
                    <p className="text-sm text-gray-600">Consultez, modifiez ou suivez l’avancement de vos demandes en cours.</p>
                </div>

                <div className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">👤 Mon profil</h2>
                    <p className="text-sm text-gray-600">Gérez vos infos personnelles et vos préférences de compte.</p>
                </div>

                <div className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">💳 Moyens de paiement</h2>
                    <p className="text-sm text-gray-600">Ajoutez ou mettez à jour vos cartes ou IBAN.</p>
                </div>

                <div className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">🎁 Parrainage</h2>
                    <p className="text-sm text-gray-600">Parrainez un proche et gagnez des avantages exclusifs.</p>
                </div>

                <div className="border p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">📃 Attestations</h2>
                    <p className="text-sm text-gray-600">Téléchargez vos justificatifs pour la CAF ou les impôts.</p>
                </div>
            </div>
        </div>
    );
};

export default AppHome;
