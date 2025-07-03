import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "@/config";

const Securite = () => {
    const { user, setUser } = useContext(UserContext);
    const realUser = user?.user || user;
    const navigate = useNavigate();

    // États pour la modale de changement de mot de passe
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [editPwd, setEditPwd] = useState(false);
    const [newPwd, setNewPwd] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        const confirmDelete = confirm("Es-tu sûr·e de vouloir supprimer ton compte ?");
        if (!confirmDelete) return;
        const token = localStorage.getItem("token");
        if (!token) return alert("Non connecté !");
        try {
            await axios.delete(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem("token");
            setUser(null);
            alert("Compte supprimé.");
            navigate("/");
        } catch (err) {
            alert("Erreur lors de la suppression du compte.");
        }
    };

    const handleChangePassword = () => setShowPwdModal(true);

    const handlePwdSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return alert("Non connecté !");
        try {
            await axios.patch(`${API_URL}/users/me`, {
                password: newPwd
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Mot de passe changé !");
            setEditPwd(false);
            setNewPwd("");
        } catch (err) {
            alert("Erreur lors du changement de mot de passe.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl flex flex-col items-center mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800"> Sécurité</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-6 w-[60em]">
                <div className="bg-[#E9FADF] border border-[#155250] p-4 rounded-md text-[#155250] ">
                    Configurez votre profil utilisateur pour une utilisation optimale.
                    <a href="#" className="ml-2 underline text-sm">Comment ça marche ?</a>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800 font-medium">{realUser?.mail}</p>
                        </div>
                        <button className="px-4 py-1 border border-[#155250]  text-[#155250]  rounded-md hover:bg-blue-50 text-sm" disabled>
                            Modifier
                        </button>
                    </div>

                    <div className="flex justify-between items-center border-b pb-3">
                        <div>
                            <p className="text-sm text-gray-500">Changer de mot de passe</p>
                        </div>
                        {editPwd ? (
                            <form onSubmit={handlePwdSubmit} className="flex gap-2 items-center">
                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    value={newPwd}
                                    onChange={e => setNewPwd(e.target.value)}
                                    className="border rounded px-3 py-2 text-sm"
                                    required
                                />
                                <button type="button" onClick={() => { setEditPwd(false); setNewPwd(""); }} className="px-3 py-1 bg-gray-200 rounded text-sm">Annuler</button>
                                <button type="submit" className="px-3 py-1 bg-[#155250]  text-white rounded text-sm" disabled={loading}>
                                    {loading ? "..." : "Valider"}
                                </button>
                            </form>
                        ) : (
                            <button onClick={() => setEditPwd(true)} className="px-4 py-1 border border-[#155250]  text-[#155250]  rounded-md hover:bg-blue-50 text-sm">
                                Modifier
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Supprimer mon compte</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="px-4 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>

            {/* Modale de changement de mot de passe minimaliste */}
            {showPwdModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <form onSubmit={handlePwdSubmit} className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[300px]">
                        <p className="text-base font-medium">Nouveau mot de passe</p>
                        <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={newPwd}
                            onChange={e => setNewPwd(e.target.value)}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowPwdModal(false)} className="px-3 py-1 bg-gray-200 rounded">Annuler</button>
                            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>
                                {loading ? "..." : "Valider"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Securite;
