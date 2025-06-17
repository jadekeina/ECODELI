import { createContext, useState, useEffect, ReactNode } from "react";

// Typage de l'utilisateur
interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token?: string;
    // Ajoute d'autres propriétés ici si besoin
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Création du contexte avec valeur par défaut
export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

// Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:3002/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                setUser(data.data); // <- ⚠️ corrige selon ce que retourne ton backend
            } catch (err) {
                console.error("Erreur lors de la récupération de l'utilisateur :", err);
                setUser(null);
            }
        };

        fetchUser();
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
