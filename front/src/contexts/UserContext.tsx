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
    shop_owner_id?: number; // <-- C'est crucial que cette propriété soit là
    [key: string]: any; // Permet d'autres propriétés dynamiques
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
                console.log("--- UserContext: No token found. Setting user to null. ---");
                setUser(null);
                setLoading(false);
                return;
            }

            console.log("--- UserContext: Token found. Fetching user details... ---");
            try {
                const res = await fetch(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    console.error("❌ UserContext: API response for /users/me not OK:", res.status, res.statusText);
                    localStorage.removeItem("token");
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                console.log("✅ UserContext: Raw JSON data from /users/me API:", data);

                // --- LA LIGNE CRUCIALE : Accéder directement à 'data' ---
                // Si votre backend renvoie directement l'objet utilisateur (comme getMe.js le fait),
                // alors 'data' est l'objet utilisateur lui-même.
                const userFromApi = data;

                console.log("✅ UserContext: Extracted userFromApi (should contain shop_owner_id if shop-owner):", userFromApi);

                const mappedUser: User = {
                    id: userFromApi.id,
                    firstname: userFromApi.firstname,
                    lastname: userFromApi.lastname,
                    email: userFromApi.email,
                    token: token,
                    role: userFromApi.role,
                    statut: userFromApi.statut,
                    profilpicture: userFromApi.profilpicture,
                    shop_owner_id: userFromApi.shop_owner_id, // <-- Assurez-vous que cette ligne est là
                };

                console.log("📦 UserContext: Mapped user object (mappedUser) for context:", mappedUser);

                setUser(mappedUser);

            } catch (err) {
                console.error("❌ UserContext: Error during fetchUser in UserContext:", err);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
                console.log("--- UserContext: fetchUser process completed. ---");
            }
        };

        fetchUser();
    }, []);

    const hasProAccount =
        !!user &&
        ["provider", "delivery-driver", "shop-owner"].includes(user.role || "") &&
        user.statut === "valide";

    console.log("🧩 UserContext: hasProAccount :", hasProAccount);
    console.log("🧑‍💼 UserContext: user.role :", user?.role);
    console.log("📃 UserContext: user.statut :", user?.statut);
    console.log("🏪 UserContext: user.shop_owner_id :", user?.shop_owner_id); // Log final pour vérifier

    return (
        <UserContext.Provider
            value={{ user, setUser, loading, mode, setMode, hasProAccount }}
        >
            {children}
        </UserContext.Provider>
    );
};
