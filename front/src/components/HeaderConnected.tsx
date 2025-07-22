import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { FaBriefcase, FaUserCircle } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import API_URL from "@/config";

const HeaderConnected = () => {
  const { user, setUser, hasProAccount, mode, setMode } =
    useContext(UserContext);

  console.log("🔍 [HeaderConnected] hasProAccount :", hasProAccount);
  console.log("👤 [HeaderConnected] user :", user);
  console.log("🕹️ [HeaderConnected] mode :", mode);

  const realUser = user?.user || user;
  const defaultPictures = ["default.jpg", "/uploads/default-avatar.png"];
  const hasCustomPhoto =
    realUser?.profilpicture &&
    !defaultPictures.includes(realUser.profilpicture);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
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
      console.error("Erreur lors de la déconnexion :", error);
    }
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
      <nav className="hidden lg:flex gap-8 text-m font-medium">
        <Link
          to={mode === "pro" ? "/annonces" : "/offres"}
          className="hover:underline"
        >
          {mode === "pro" ? "Toues les Annonces" : "Toutes nos Offres"}
        </Link>
      </nav>

      {/* Icônes à droite */}
      <div className="flex items-center gap-6 text-sm">
        {/* Switch mode Client / Pro */}
        {hasProAccount ? (
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setMode(mode === "client" ? "pro" : "client")}
              className="text-sm bg-[#1B4F3C] text-white px-4 py-2 rounded-full hover:bg-[#154534] transition"
            >
              Mode : {mode === "client" ? "Client 👤" : "Pro 💼"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Link
              to="/inscription-pro"
              className="flex flex-col items-center text-[#1B4F3C] hover:text-[#0f3329]"
            >
              <FaBriefcase className="text-3xl" />
              <span className="text-sm mt-1">Devenir pro</span>
            </Link>
          </div>
        )}

        {/* Déposer une annonce / offre */}
        <div className="flex flex-col items-center justify-center">
          <Link
            to={mode === "client" ? "/deposer-annonce" : "/publier-offre"}
            className="flex flex-col items-center text-[#1B4F3C] hover:text-[#0f3329]"
          >
            <span className="text-3xl">{mode === "client" ? "📢" : "🛠️"}</span>
            <span className="text-sm mt-1">
              {mode === "client" ? "Déposer une annonce" : "Publier une offre"}
            </span>
          </Link>
        </div>

        {/* Profil */}
        <div className="relative flex flex-col items-center" ref={userMenuRef}>
          <button
            onClick={toggleUserMenu}
            className="flex flex-col items-center text-[#1B4F3C] hover:text-[#0f3329]"
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
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mon-compte"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mon compte
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mes-prestations"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mes prestations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mes-trajets"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mes trajets
                  </Link>
                </li>
                <li>
                  <Link to="/history" onClick={() => setIsUserMenuOpen(false)}>
                    Historique
                  </Link>
                </li>
                <li>
                  <Link
                    to="/abonnement"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
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

export default HeaderConnected;

// Dropdown
// @ts-expect-error
const Dropdown = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      <div
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
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
