import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"; // Assurez-vous que ce chemin est correct
import { FaBriefcase, FaUserCircle } from "react-icons/fa";
import { ChevronDown } from "lucide-react";


const HeaderConnected = () => {
    // Assurez-vous que UserContext est correctement typé, par exemple:
    // const { user, setUser } = useContext(UserContext as React.Context<UserContextType>);
    const { user, setUser } = useContext(UserContext); 
    console.log("HeaderConnected user:", user);

    const realUser = user?.user || user;

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            await fetch("http://localhost:3002/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user?.id }), // ← envoie bien l'userId
            });
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }

        // Ensuite, nettoyage local
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };


    return (
        <header className="w-full bg-white px-6 py-4 flex justify-between items-center shadow text-[#1B4F3C] text-base">
            {/* Logo */}
            <Link to="/app" className="text-2xl font-bold">
                ecodeli
            </Link>

            {/* Menu principal */}
            <nav className="hidden lg:flex gap-8 text-sm font-medium">
                <Dropdown title="Livraison">
                    <Link to="/livraison/envoyer-colis">📦 Envoyer un colis</Link>
                    <Link to="/livraison/partielle">🔁 Livraison partielle</Link>
                    <Link to="/livraison/finale">🎯 Livraison finale</Link>
                    <Link to="/livraison/suivi">🔍 Suivi en temps réel</Link>
                    <Link to="/livraison/assurance">✅ Assurance incluse</Link>
                </Dropdown>

                <Dropdown title="Proposer un trajet">
                    <Link to="/proposer-trajet/crowdshipping">🚗 Crowdshipping</Link>
                    <Link to="/proposer-trajet/dernier-km">🚶 Dernier km uniquement</Link>
                    <Link to="/proposer-trajet/groupage">📦 Livraison groupée</Link>
                </Dropdown>

                <Dropdown title="Courses & achats">
                    <Link to="/courses-achats/chariot">🛒 Lâcher de chariot</Link>
                    <Link to="/courses-achats/pour-client">👥 Courses pour un client</Link>
                    <Link to="/courses-achats/etranger">🌍 Achat à l'étranger</Link>
                </Dropdown>

                <Dropdown title="Transport">
                    <Link to="/transport/rdv-gare">🚉 Transport RDV / gare</Link>
                    <Link to="/transport/aeroport">✈️ Transfert aéroport</Link>
                    <Link to="/transport/aide">♿ Aide au déplacement</Link>
                </Dropdown>

                <Dropdown title="Aide à domicile">
                    <Link to="/aide-domicile/animaux">🐶 Garde d'animaux</Link>
                    <Link to="/aide-domicile/menage">🧼 Ménage</Link>
                    <Link to="/aide-domicile/jardinage">🌿 Jardinage</Link>
                    <Link to="/aide-domicile/travaux">🛠️ Petits travaux</Link>
                </Dropdown>
            </nav>

            {/* Icônes alignées à droite */}
            <div className="flex items-center gap-6 text-sm">
                {/* Devenir pro */}
                <div className="flex flex-col items-center justify-center">
                    <Link to="/rejoindre" className="flex flex-col items-center text-[#1B4F3C] hover:text-[#0f3329]">
                        <FaBriefcase className="text-3xl" />
                        <span className="text-xs mt-1">Devenir pro</span>
                    </Link>
                </div>

                {/* Profil utilisateur */}
                <div className="relative flex flex-col items-center" ref={userMenuRef}>
                    <button onClick={toggleUserMenu} className="flex flex-col items-center text-[#1B4F3C] hover:text-[#0f3329]">
                        <FaUserCircle className="text-3xl" />
                        <span className="text-xs mt-1">
                            {realUser?.firstname ? `${realUser.firstname} ${realUser.lastname?.charAt(0) || ''}.` : ''}
                        </span>

                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white border rounded-lg shadow-lg text-sm p-4 z-50">
                            <ul className="space-y-3">
                                <li><Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>Tableau de bord</Link></li>
                                <li><Link to="/reservations" onClick={() => setIsUserMenuOpen(false)}>Mes réservations</Link></li>
                                <li><Link to="/mes-trajets" onClick={() => setIsUserMenuOpen(false)}>Mes trajets</Link></li>
                                <li><Link to="/historique" onClick={() => setIsUserMenuOpen(false)}>Historique</Link></li>
                                <li><Link to="/abonnement" onClick={() => setIsUserMenuOpen(false)}>Abonnement</Link></li>
                                <li>
                                    <button onClick={handleLogout} className="text-red-600">Se déconnecter</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderConnected;

// Component pour les dropdowns
const Dropdown = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="relative cursor-pointer" ref={dropdownRef}>
            <div className="flex items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
                {title} <ChevronDown size={16} />
            </div>
            {isOpen && (
                <div className="absolute top-8 left-0 flex flex-col bg-white rounded-lg p-4 shadow-lg min-w-[260px] z-50 text-sm space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
};