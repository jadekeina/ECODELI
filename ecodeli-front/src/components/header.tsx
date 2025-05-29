import { useLocation, Link } from "react-router-dom";
import "../styles/fonts.css";
import ButtonPlus from "./ui/ButtonPlus.tsx";
import VoirAnnonce from "../assets/Image/VoirAnnonce.png";
import ExpedierColis from "../assets/Image/ExpédierColis.png";

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/connexion";
  const isRegisterPage = location.pathname === "/inscription";
  const isAuthPage = isLoginPage || isRegisterPage;

  return (
    <header className={`w-full ${isAuthPage ? 'bg-white text-[#155250] font-bold' : 'bg-[#155250] text-white '} h-16 px-4 flex items-center justify-between`}>
      <Link to="/" className="text-lg font-bold">
        ecodeli
      </Link>

      {!isAuthPage && (
        <div className="flex mx-12 items-center gap-4">
          <nav
            style={{
              fontFamily: "ArchivGrotesk-Light",
              fontWeight: "normal",
              fontStyle: "normal",
            }}
            className="flex gap-35 items-center justify-center"
          >
            <div className="flex gap-7 left-5 ">
              <Link to="/prix" className="hover:opacity-80 transition">
                Prix
              </Link>
              <Link
                to="/NosEngagements"
                className="hover:opacity-80 transition"
              >
                Nos Engagements
              </Link>
              <Link to="/Comment-ca-marche" className="hover:opacity-80 transition">
                Comment ça marche ?
              </Link>
            </div>

            <Link to="/Comment-ca-marche" className="hover:opacity-80 transition ">
              <div className="flex flex-col items-center">
                <div>
                  <ButtonPlus />
                </div>
                <div className="text-xs"> Demandes</div>
              </div>
            </Link>

            <div className="flex gap-7  ">
              <Link to="/expedier-ou-recevoir" className="hover:opacity-80 transition">
                <div className="flex gap-2 ">
                  <div>
                    <img src={VoirAnnonce} alt=" Expédier ou recevoir un colis" />
                  </div>
                  <div> Expédier ou recevoir un colis </div>
                </div>
              </Link>
              <Link to="/contact" className="hover:opacity-80 transition">
                <div className="flex gap-2 ">
                  <div>
                    <img src={ExpedierColis} alt="Voir les annonces" />
                  </div>
                  <div>voir les annonces</div>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {!isAuthPage && (
        <div className="flex gap-3">
          <Link to="/inscription">
          </Link>

          <Link to="/connexion">
            <button
              className={`px-4 py-1 border rounded-full transition ${
                location.pathname === "/connexion"
                  ? "bg-[#155250] text-white border-[#155250]"
                  : isAuthPage 
                    ? "text-[#155250] border-[#155250] hover:bg-[#155250] hover:text-white"
                    : "text-white border-white hover:bg-white hover:text-[#155250]"
              }`}
            >
              Se connecter
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
