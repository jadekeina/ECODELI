import {JSX, useContext} from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("token");

    // Si aucun utilisateur connecté ou token invalide, on redirige vers /connexion
    if (!user || !token) {
        return <Navigate to="/connexion" replace />;
    }

    // Sinon on affiche la page demandée
    return children;
};

export default ProtectedRoute;
