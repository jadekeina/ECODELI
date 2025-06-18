const jwt = require("jsonwebtoken");
const db = require("../../config/db");

async function createDeliveryDriver(token, data) {
    try {
        // ✅ Vérifie le token pour récupérer l'ID utilisateur connecté
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        // ✅ Insère dans la table livreurs (avec statut en attente)
        const sql = `INSERT INTO livreurs (user_id, zone_deplacement, statut_validation) VALUES (?, ?, ?)`;
        const values = [userId, data.zone_deplacement || null, "en_attente"];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve({ message: "Profil livreur créé avec succès" });
            });
        });
    } catch (err) {
        throw new Error("Token invalide ou expiré");
    }
}

module.exports = createDeliveryDriver();
