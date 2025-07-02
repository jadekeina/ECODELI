import {JSX, useContext} from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("token");

    if (!user || !token) {
        return <Navigate to="/connexion" replace />;
    }

    return children;
};

export default ProtectedRoute;
