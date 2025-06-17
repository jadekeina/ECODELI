import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token?: string; // Le token ne devrait pas être stocké directement dans l'objet utilisateur de contexte pour des raisons de sécurité
    // Ajoute d'autres propriétés ici si besoin
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            console.log("UserProvider: Vérification du token:", token); // Debugging
            if (!token) {
                console.log("UserProvider: Pas de token, utilisateur non connecté.");
                setUser(null); // S'assurer que l'état est null si pas de token
                return;
            }

            try {
                // !!! Vérifiez attentivement l'URL de votre API ici !!!
                const apiUrl = "http://localhost:3002/users/me";
                console.log("UserProvider: Appel à l'API:", apiUrl); // Debugging

                const res = await fetch(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    console.error("UserProvider: Erreur réponse API:", res.status, res.statusText); // Debugging
                    const errorBody = await res.text(); // Lire le corps de l'erreur pour plus de détails
                    console.error("UserProvider: Corps de l'erreur:", errorBody);
                    setUser(null); // Déconnecte l'utilisateur si la réponse n'est pas OK (ex: 401)
                    return;
                }

                const data = await res.json();
                console.log("UserProvider: Données brutes de l'API reçues:", data); // Debugging IMPORTANT

                // C'est ici que vous décidez comment extraire l'utilisateur de 'data'
                // Si 'data' est directement l'objet utilisateur:
                setUser(data);

                // Si l'utilisateur est dans data.data:
                // setUser(data.data);

                // Si l'utilisateur est dans data.user:
                // setUser(data.user);

                // Si vous avez un doute, laissez `setUser(data);` et examinez le console.log de `data`


            } catch (err) {
                console.error("UserProvider: Erreur lors de la récupération de l'utilisateur (fetch catch):", err); // Debugging
                setUser(null); // Déconnecte l'utilisateur en cas d'erreur réseau
            }
        };

        fetchUser();
    }, []); // Le tableau de dépendances vide signifie que cela ne s'exécute qu'une fois au montage.

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};