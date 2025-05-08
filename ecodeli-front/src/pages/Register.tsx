import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-[#1a6350] text-center">Créer un compte</h1>
        
        <input
          type="text"
          placeholder="Nom complet"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1a6350]"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1a6350]"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1a6350]"
        />

        <button
          type="submit"
          className="w-full bg-[#1a6350] text-white py-2 rounded hover:bg-[#155c47] transition"
        >
          S’inscrire
        </button>

        <p className="text-sm text-center text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" className="text-[#1a6350] hover:underline">
            Connectez-vous
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
