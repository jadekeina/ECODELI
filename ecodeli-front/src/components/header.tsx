import { useLocation, Link } from "react-router-dom";
import "../styles/fonts.css";

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/connexion";
  const isRegisterPage = location.pathname === "/inscription";
  const isAuthPage = isLoginPage || isRegisterPage;

  return (
    <header className={`w-full font-outfit-regular ${isAuthPage ? 'bg-white text-[#155250] font-outfit-bold' : 'text-[#1B4F3C]'} h-20 px-6 flex items-center justify-between shadow-sm`}>
      {/* Logo */}
      <Link to="/" className="text-2xl font-outfit-semibold tracking-wide">
        ecodeli
      </Link>

      {/* Menu central (si non connecté) */}
      {!isAuthPage && (
        <nav className="flex gap-10 text-md font-outfit-medium items-center">
          <Link to="/NosEngagements" className="hover:text-[#155250] transition">
            Nos engagements
          </Link>
          <Link to="/pour-qui" className="hover:text-[#155250] transition">
            Pour qui ?
          </Link>
          <Link to="/contact" className="hover:text-[#155250] transition">
            Contact
          </Link>
        </nav>
      )}

      {/* Bouton Se connecter */}
      {!isAuthPage && (
        <Link to="/connexion">
          <button
            className={`px-5 py-2 rounded-full text-white bg-[#155250] hover:bg-[#103f38] transition duration-300 font-outfit-medium`}
          >
            Se connecter
          </button>
        </Link>
      )}
    </header>
  );
};

export default Header;
