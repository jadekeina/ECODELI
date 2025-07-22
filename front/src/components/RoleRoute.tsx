import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

interface RoleRouteProps {
    children: JSX.Element;
    allowedRoles: string[]; // ex: ["client", "provider"]
}

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
    // Récupérer l'état de chargement depuis le UserContext
    const { user, loading } = useContext(UserContext); // Modifier ici pour inclure 'loading'

    // Si le contexte utilisateur est en cours de chargement, affiche un message ou un spinner
    if (loading) { // Vérifier l'état de chargement
        return <p className="p-6">Chargement des permissions...</p>;
    }

    // Si l'utilisateur n'est pas connecté après le chargement, rediriger
    if (!user) {
        return <Navigate to="/connexion" replace />;
    }

    // Si l'utilisateur est connecté mais son rôle n'est pas autorisé, rediriger
    if (!user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/access-denied" replace />;
    }

    // Si l'utilisateur est connecté et le rôle est autorisé, afficher le contenu enfant
    return children;
};

export default RoleRoute;