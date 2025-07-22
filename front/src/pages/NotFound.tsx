import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("404 - Page introuvable | EcoDeli");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-[#1B4F3C] mb-4">
        404 - Page introuvable
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Link
        to="/app"
        className="px-6 py-3 bg-[#1B4F3C] text-white rounded hover:bg-[#154534] transition"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
};

export default NotFound;
