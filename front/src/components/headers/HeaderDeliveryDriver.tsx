import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import API_URL from "@/config";

const HeaderDeliveryDriver = () => {
    const { user, setUser } = useContext(UserContext);
    const realUser = user;

    // hasCustomPhoto est déjà sécurisé avec `?.`
    const defaultPictures = ["default.jpg", "/uploads/default-avatar.png"];
    const hasCustomPhoto = realUser?.profilpicture && !defaultPictures.includes(realUser.profilpicture);

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    useEffect(() => {
        if (realUser && realUser.token) {
            console.log("[HeaderDeliveryDriver] Token du driver disponible:", realUser.token.substring(0, 10) + "...");
        } else {
            console.log("[HeaderDeliveryDriver] Pas de token de driver disponible.");
        }
    }, [realUser]);

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
            console.error("Erreur de déconnexion:", error);
        }
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeMobileMenu}
                />
            )}

            <header className="w-full bg-white px-6 py-4 flex justify-between items-center shadow text-[#1a1a1a] text-lg relative z-50">
                <Link to="/app" className="text-2xl font-bold text-[#1B4F3C]">
                    ecodeli
                </Link>

                <nav className="hidden lg:flex gap-10 font-semibold">
                    <Link to="/livraisons" className="hover:text-[#1B4F3C]">Mes livraisons</Link>
                    <Link to="/offres-livraison" className="hover:text-[#1B4F3C]">Offres disponibles</Link>
                    <Link to="/livraisons/historique" className="hover:text-[#1B4F3C]">Historique</Link>
                    <Link to="/livraisons/paiements" className="hover:text-[#1B4F3C]">Paiements</Link>
                </nav>


                <div className="flex items-center gap-6 text-xl">
                    <Link to="/notifications" className="hover:text-[#1B4F3C]">
                        <FaBell className="text-2xl" />
                    </Link>

                    <div className="relative flex flex-col items-center" ref={userMenuRef}>
                        <button onClick={toggleUserMenu} className="flex flex-col items-center text-[#1a1a1a] hover:text-[#1B4F3C]">
                            {/* Correction ici : Vérifier que realUser existe avant d'accéder à profilpicture */}
                            {realUser && hasCustomPhoto ? (
                                <img
                                    src={`${API_URL}${realUser.profilpicture}`}
                                    alt="Profil"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <FaUserCircle className="text-3xl" />
                            )}
                            <span className="text-sm mt-1">
                                {realUser?.firstname ? `${realUser.firstname} ${realUser.lastname?.charAt(0) || ""}.` : ""}
                            </span>
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white border rounded-lg shadow-lg text-sm p-4 z-50">
                                <ul className="space-y-3">
                                    <li><Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>Dashboard</Link></li>
                                    <li><Link to="/mon-compte" onClick={() => setIsUserMenuOpen(false)}>Mon compte</Link></li>
                                    <li><button onClick={handleLogout} className="text-red-600">Se déconnecter</button></li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button className="lg:hidden text-2xl" onClick={toggleMobileMenu}>
                        <FaBars />
                    </button>
                </div>

                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg flex flex-col items-start gap-4 px-6 py-8 z-50 text-base font-medium transform transition-transform duration-300 ${
                        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <button className="self-end mb-4 text-xl" onClick={closeMobileMenu}>✕</button>
                    <Link to="/livraisons/historique" className="hover:text-[#1B4F3C]" onClick={closeMobileMenu}>Historique</Link>
                    <Link to="/livraisons/paiements" className="hover:text-[#1B4F3C]" onClick={closeMobileMenu}>Paiements</Link>
                </div>
            </header>
        </>
    );
};

export default HeaderDeliveryDriver;
