import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token?: string;
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            console.log("UserProvider: Vérification du token:", token);

            if (!token) {
                console.log("UserProvider: Pas de token, utilisateur non connecté.");
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const apiUrl = "http://localhost:3002/users/me";
                console.log("UserProvider: Appel à l'API:", apiUrl);

                const res = await fetch(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    console.error("UserProvider: Erreur réponse API:", res.status, res.statusText);
                    const errorBody = await res.text();
                    console.error("UserProvider: Corps de l'erreur:", errorBody);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                console.log("UserProvider: Données brutes de l'API reçues:", data);

                const userFromApi = data.data;
                const mappedUser: User = {
                    id: userFromApi.id,
                    firstname: userFromApi.firstname,
                    lastname: userFromApi.lastname,
                    email: userFromApi.mail, // conversion ici
                    token: userFromApi.token,
                };

                setUser(mappedUser);
            } catch (err) {
                console.error("UserProvider: Erreur lors de la récupération de l'utilisateur:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
