import { useLocation, Link } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full bg-[#1a6350] text-white h-14 px-12 flex items-center justify-between">
      <Link to="/" className="text-lg font-bold">ecodeli</Link>

      <nav className="flex gap-8">
        <Link to="/services" className="hover:opacity-80 transition">Services</Link>
        <Link to="/comment-ca-marche" className="hover:opacity-80 transition">Comment ça marche</Link>
        <Link to="/devenir-livreur" className="hover:opacity-80 transition">Devenir livreur</Link>
        <Link to="/a-propos" className="hover:opacity-80 transition">À propos</Link>
        <Link to="/contact" className="hover:opacity-80 transition">Contact</Link>
      </nav>


      <div className="flex gap-3">
        <Link to="/inscription">
          <button
            className={`px-4 py-1 border rounded-full transition ${
              location.pathname === '/inscription'
                ? 'bg-white text-[#1a6350] border-white'
                : 'text-white border-white hover:bg-white hover:text-[#1a6350]'
            }`}
          >
            S’inscrire
          </button>
        </Link>

        <Link to="/connexion">
          <button
            className={`px-4 py-1 border rounded-full transition ${
              location.pathname === '/connexion'
                ? 'bg-white text-[#1a6350] border-white'
                : 'text-white border-white hover:bg-white hover:text-[#1a6350]'
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
