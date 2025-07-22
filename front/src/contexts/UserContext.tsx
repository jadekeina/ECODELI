import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API_URL from "@/config";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token?: string;
    role?: string;
    statut?: string;
    profilpicture?: string;
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    mode: "client" | "pro";
    setMode: (mode: "client" | "pro") => void;
    hasProAccount: boolean;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true,
    mode: "client",
    setMode: () => {},
    hasProAccount: false,
});

export const useUserContext = (): UserContextType => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mode, setMode] = useState<"client" | "pro">("client");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    localStorage.removeItem("token");
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                const userFromApi = data.data;

                const mappedUser: User = {
                    id: userFromApi.id,
                    firstname: userFromApi.firstname,
                    lastname: userFromApi.lastname,
                    email: userFromApi.email, // Corrigé de 'mail' à 'email' si c'est la clé correcte de l'API
                    token: token, // <-- C'est LA LIGNE CLÉ !
                    role: userFromApi.role,
                    statut: userFromApi.statut,
                    profilpicture: userFromApi.profilpicture,
                };

                console.log("🌐 API_URL = ", import.meta.env.VITE_API_URL);
                console.log("📦 [UserContext] Utilisateur récupéré :", mappedUser);

                setUser(mappedUser);
            } catch (err) {
                console.error("❌ Erreur API /users/me :", err);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const hasProAccount =
        !!user &&
        ["provider", "delivery-driver", "shop-owner"].includes(user.role || "") &&
        user.statut === "valide";

    console.log("🧩 [UserContext] hasProAccount :", hasProAccount);
    console.log("🧑‍💼 [UserContext] user.role :", user?.role);
    console.log("📃 [UserContext] user.statut :", user?.statut);

    return (
        <UserContext.Provider
            value={{ user, setUser, loading, mode, setMode, hasProAccount }}
        >
            {children}
        </UserContext.Provider>
    );
};