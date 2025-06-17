import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const HeaderConnected = () => {
    const { user, setUser } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <header className="w-full bg-white px-6 py-4 flex justify-between items-center shadow">
            <Link to="/app" className="text-2xl font-bold text-[#1B4F3C]">
                ecodeli
            </Link>

            <nav className="flex items-center gap-10 text-[#1B4F3C] font-medium">
                <Link to="/app">Accueil</Link>
                <Link to="/services">Services</Link>
                <Link to="/contact">Contact</Link>

                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center gap-2 text-[#1B4F3C] hover:text-[#0f3329]"
                    >
                        <span>{user?.firstname} {user?.lastname?.charAt(0)}.</span>
                        <span className="text-xl">▾</span>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50">
                            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Tableau de bord</Link>
                            <Link to="/rendez-vous" className="block px-4 py-2 hover:bg-gray-100">Mes rendez-vous</Link>
                            <Link to="/historique" className="block px-4 py-2 hover:bg-gray-100">Historique & factures</Link>
                            <Link to="/parrainage" className="block px-4 py-2 hover:bg-gray-100">Parrainage</Link>
                            <Link to="/profil" className="block px-4 py-2 hover:bg-gray-100">Mon profil</Link>
                            <Link to="/paiements" className="block px-4 py-2 hover:bg-gray-100">Moyens de paiements</Link>
                            <Link to="/attestations" className="block px-4 py-2 hover:bg-gray-100">Attestations CAF</Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            >
                                Me déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default HeaderConnected;
