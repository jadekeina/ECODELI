const jwt = require("jsonwebtoken");
const db = require("../../models/deliveryDriver");

async function createDeliveryDriver(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO livreurs (user_id, zone_deplacement, statut_validation) VALUES (?, ?, 'en_attente')";
            db.query(sql, [userId, data.zone_deplacement], (err, result) => {
                if (err) return reject(err);
                resolve({ message: "Profil livreur créé avec succès" });
            });
        });

    } catch (err) {
        throw new Error("Token invalide ou expiré");
    }
}

module.exports = createDeliveryDriver;
