import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaUserCircle } from "react-icons/fa";
import API_URL from "@/config";

const HeaderClient = () => {
    const { user, setUser } = useContext(UserContext);
    const realUser = user?.user || user;

    const defaultPictures = ["default.jpg", "/uploads/default-avatar.png"];
    const hasCustomPhoto =
        realUser?.profilpicture && !defaultPictures.includes(realUser.profilpicture);

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
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user?.id }),
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <header className="w-full bg-white px-6 py-4 flex justify-between items-center shadow text-[#1a1a1a] text-base">
            {/* Logo */}
            <Link to="/app" className="text-2xl font-bold text-[#1B4F3C]">
                ecodeli
            </Link>

            {/* Main menu */}
            <nav className="hidden lg:flex gap-8 text-m font-medium">
                <Link to="/offres" className="hover:text-[#1B4F3C]">
                    Toutes nos Offres
                </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-6 text-sm">
                {/* Post request */}
                <div className="flex flex-col items-center justify-center">
                    <Link
                        to="/deposer-annonce"
                        className="flex flex-col items-center text-[#1a1a1a] hover:text-[#1B4F3C]"
                    >
                        <span className="text-3xl">📢</span>
                        <span className="text-sm mt-1">Déposer une annonce</span>
                    </Link>
                </div>

                {/* Profile */}
                <div className="relative flex flex-col items-center" ref={userMenuRef}>
                    <button
                        onClick={toggleUserMenu}
                        className="flex flex-col items-center text-[#1a1a1a] hover:text-[#1B4F3C]"
                    >
                        {hasCustomPhoto ? (
                            <img
                                src={`${API_URL}${realUser.profilpicture}`}
                                alt="Profil"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="text-3xl" />
                        )}
                        <span className="text-sm mt-1">
              {realUser?.firstname
                  ? `${realUser.firstname} ${realUser.lastname?.charAt(0) || ""}.`
                  : ""}
            </span>
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white border rounded-lg shadow-lg text-sm p-4 z-50">
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mon-compte" onClick={() => setIsUserMenuOpen(false)}>
                                        Mon compte
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mes-trajets" onClick={() => setIsUserMenuOpen(false)}>
                                        Mes trajets
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/history" onClick={() => setIsUserMenuOpen(false)}>
                                        Historique
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/abonnement" onClick={() => setIsUserMenuOpen(false)}>
                                        Abonnement
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="text-red-600">
                                        Se déconnecter
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderClient;
