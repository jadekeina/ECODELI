// Path: ../../../controllers/shopowner_requests/getMyShopOwnerRequests.js
const dbConnection = require("../../../config/db"); // Importe votre connexion non-Promise

// Convertit la connexion en Promise pour ce module
const db = dbConnection.promise();

module.exports = async (req, res) => {
    try {
        // Vérifie si l'utilisateur est authentifié et a le rôle "shop-owner"
        if (!req.user || req.user.role !== "shop-owner") {
            return res.status(403).json({ message: "Accès non autorisé." });
        }

        const userId = req.user.id;

        // Exécute la requête SQL et attend le résultat (maintenant que db est compatible Promise)
        const [rows] = await db.query("SELECT * FROM shopowner_requests WHERE user_id = ?", [userId]);

        // Renvoie les annonces trouvées
        res.status(200).json(rows);

    } catch (err) {
        // Gère les erreurs serveur
        console.error("[getMyShopOwnerRequests] Erreur :", err); // Garder le log d'erreur est une bonne pratique
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};