import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const breadcrumb = location.pathname
        .split("/")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" / ");

    const handleLogout = () => {
        try {
            console.log("🔄 Déconnexion en cours...");

            // Supprimer le token du localStorage
            localStorage.removeItem("token");

            console.log("✅ Token supprimé");

            // Rediriger vers la page de connexion
            navigate("/admin-login", { replace: true });

            console.log("✅ Redirection vers /admin-login");

        } catch (error) {
            console.error("❌ Erreur lors de la déconnexion:", error);

            // Même en cas d'erreur, on redirige vers la page de connexion
            navigate("/admin-login", { replace: true });
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white">
            <div className="text-sm text-gray-500 font-medium">
                {breadcrumb || "Dashboard"}
            </div>

            <div className="flex items-center gap-4">
                {/* <input
                    type="text"
                    placeholder="Rechercher..."
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                />
                {/*<button className="border rounded-md px-3 py-1 text-sm">FR</button>*/}
                <button
                    onClick={handleLogout}
                    className="border rounded-md px-3 py-1 text-sm bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
                >
                    Déconnexion
                </button>
            </div>
        </header>
    );
}