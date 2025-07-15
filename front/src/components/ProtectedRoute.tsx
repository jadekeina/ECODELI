import {JSX, useContext} from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useContext(UserContext);
    const token = localStorage.getItem("token");

    // Attendre que le chargement soit terminé
    if (loading) {
        return <div>Chargement...</div>;
    }

    // Rediriger si pas d'utilisateur connecté OU pas de token
    if (!user || !token) {
        return <Navigate to="/connexion" replace />;
    }

    return children;
};

export default ProtectedRoute;
