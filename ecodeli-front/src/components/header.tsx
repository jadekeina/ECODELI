import { useLocation, Link } from "react-router-dom";
import "../styles/fonts.css";
import ButtonPlus from "./ui/ButtonPlus.tsx";
import VoirAnnonce from "../assets/VoirAnnonce.png";
import ExpedierColis from "../assets/ExpédierColis.png";


const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full bg-[#1a6350] text-white h-16 px-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
        ecodeli
      </Link>

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
        <Link to="/services" className="hover:opacity-80 transition">
          Prix
        </Link>
        <Link to="/comment-ca-marche" className="hover:opacity-80 transition">
          Nos Engagements
        </Link>
        <Link to="/devenir-livreur" className="hover:opacity-80 transition">
          Comment ça marche ?
        </Link>
        </div>

       
        <Link to="/devenir-livreur" className="hover:opacity-80 transition ">
        
          <div className="flex flex-col items-center">
            <div>
              <ButtonPlus/>
            </div>
            <div className="text-xs"> Demandes</div>
          </div>
        </Link>
    

        <div className="flex gap-7  "> 
        <Link to="/a-propos" className="hover:opacity-80 transition">
          <div className="flex gap-2 ">
            <div>
              <img
                src={VoirAnnonce}
                alt=" Expédier ou recevoir un colis"
              />
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

           <div className="flex gap-3">
        <Link to="/inscription">
          {/* <button
            className={`px-4 py-1 border rounded-full transition ${
              location.pathname === "/inscription"
                ? "bg-white text-[#1a6350] border-white"
                : "text-white border-white hover:bg-white hover:text-[#1a6350]"
            }`}
          >

          </button> */}
        </Link>

        <Link to="/connexion">
          <button
            className={`px-4 py-1 border rounded-full transition ${
              location.pathname === "/connexion"
                ? "bg-white text-[#1a6350] border-white"
                : "text-white border-white hover:bg-white hover:text-[#1a6350]"
            }`}
          >
            Se connecter
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
