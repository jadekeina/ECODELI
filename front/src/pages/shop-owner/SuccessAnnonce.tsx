import { Link } from "react-router-dom";

const SuccessAnnonce = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#1B4F3C] mb-4">🎉 Annonce publiée avec succès !</h1>
                <p className="mb-6">Votre demande a bien été enregistrée.</p>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/annonces/shop-owner"
                        className="px-6 py-2 bg-[#1B4F3C] text-white rounded hover:bg-[#163f30] transition"
                    >
                        Voir mon annonce
                    </Link>
                    <Link
                        to="/dashboard"
                        className="px-6 py-2 bg-gray-300 text-[#1B4F3C] rounded hover:bg-gray-400 transition"
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessAnnonce;
