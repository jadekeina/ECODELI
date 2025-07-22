import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import API_URL from "@/config";
import { useTranslation } from "react-i18next";

const HeaderClient = () => {
  const { user, setUser } = useContext(UserContext);
  const realUser = user?.user || user;

  const defaultPictures = ["default.jpg", "/uploads/default-avatar.png"];
  const hasCustomPhoto =
    realUser?.profilpicture &&
    !defaultPictures.includes(realUser.profilpicture);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      {/* Backdrop flouté */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      <header className="w-full bg-white px-6 py-4 flex justify-between items-center shadow text-[#1a1a1a] text-lg relative z-50">
        {/* Logo */}
        <Link to="/app" className="text-2xl font-bold text-[#1B4F3C]">
          ecodeli
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-10 font-semibold">
          <Link to="/app" className="hover:text-[#1B4F3C]">
            {t("headerClient.home")}
          </Link>
          <Link to="/offres" className="hover:text-[#1B4F3C]">
            {t("headerClient.offers")}
          </Link>
          <Link to="/trajet" className="hover:text-[#1B4F3C]">
            {t("headerClient.trips")}
          </Link>
          <Link to="/deposer-annonce" className="hover:text-[#1B4F3C]">
            {t("headerClient.post_ad")}
          </Link>
          <Link to="/messages" className="hover:text-[#1B4F3C]">
            {t("headerClient.messages")}
          </Link>
          <Link to="/mes-achats" className="hover:text-[#1B4F3C]">
            {t("headerClient.purchases")}
          </Link>
        </nav>

        {/* Right icons & mobile */}
        <div className="flex items-center gap-6 text-xl">
          {/* Notification */}
          <Link to="/notifications" className="hover:text-[#1B4F3C]">
            <FaBell className="text-2xl" />
          </Link>

          {/* Profile */}
          <div
            className="relative flex flex-col items-center"
            ref={userMenuRef}
          >
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
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t("headerClient.dashboard")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mon-compte"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t("headerClient.my_account")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mes-prestations"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t("headerClient.my_services")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/trajet" onClick={() => setIsUserMenuOpen(false)}>
                      {t("headerClient.my_trips")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/history"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t("headerClient.history")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/abonnement"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t("headerClient.subscription")}
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600">
                      {t("headerClient.logout")}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Burger */}
          <button className="lg:hidden text-2xl" onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg flex flex-col items-start gap-4 px-6 py-8 z-50 text-base font-medium transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button className="self-end mb-4 text-xl" onClick={closeMobileMenu}>
            ✕
          </button>
          <Link
            to="/app"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.home")}
          </Link>
          <Link
            to="/offres"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.offers")}
          </Link>
          <Link
            to="/trajet"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.trips")}
          </Link>
          <Link
            to="/deposer-annonce"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.post_ad")}
          </Link>
          <Link
            to="/mes-prestations"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.my_services")}
          </Link>
          <Link
            to="/messages"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.messages")}
          </Link>
          <Link
            to="/mes-achats"
            className="hover:text-[#1B4F3C]"
            onClick={closeMobileMenu}
          >
            {t("headerClient.purchases")}
          </Link>
        </div>
      </header>
    </>
  );
};

export default HeaderClient;
