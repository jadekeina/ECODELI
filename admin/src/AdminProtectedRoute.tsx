import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
    userId: number;
    exp: number;
    role?: string; // ← si jamais tu ajoutes le rôle dans le token plus tard
}

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const now = Math.floor(Date.now() / 1000);

            if (decoded.exp < now) {
                // token expiré
                localStorage.removeItem("token");
                setAuthorized(false);
                return;
            }

            setAuthorized(true);
        } catch (err) {
            setAuthorized(false);
        }
    }, []);

    if (authorized === null) return null; // tu peux mettre un spinner ici
    if (!authorized) return <Navigate to="/admin-login" replace />;

    return children;
};

export default AdminProtectedRoute;
