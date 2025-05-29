import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/connexion";
  const isRegisterPage = location.pathname === "/inscription";
  const isAuthPage = isLoginPage || isRegisterPage;

  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="bg-[#155250] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bloc 1 : logo / nom */}
        <div>
          <h2 className="text-2xl font-bold mb-2">ecodeli</h2>
          <p className="text-sm opacity-75">
            Le crowdshipping simple, économique, solidaire.
          </p>
        </div>

        {/* Bloc 2 : liens rapides */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Liens</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:underline">
                À propos
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Nos services
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Mentions légales
              </a>
            </li>
          </ul>
        </div>

        {/* Bloc 3 : réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Suivez-nous</h3>
          <div className="flex space-x-4">
            <a href="#">
              <img src="/icons/facebook.svg" alt="Facebook" className="h-5" />
            </a>
            <a href="#">
              <img src="/icons/twitter.svg" alt="Twitter" className="h-5" />
            </a>
            <a href="#">
              <img src="/icons/instagram.svg" alt="Instagram" className="h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Ligne en bas */}
      <div className="text-center text-xs text-white opacity-60 mt-8">
        &copy; {new Date().getFullYear()} Ecodeli. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
