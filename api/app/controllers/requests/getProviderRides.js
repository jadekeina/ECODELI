const db = require("../../../config/db");

const getProviderRides = async (providerId) => {
    console.log("[getProviderRides] providerId reçu :", providerId);
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM rides
            WHERE provider_id = ?
            ORDER BY created_at DESC
        `;

        db.query(query, [providerId], (err, results) => {
            if (err) {
                console.error("[getProviderRides] Erreur SQL:", err);
                return reject(err);
            }
            console.log("[getProviderRides] Résultats :", results);
            resolve(results);
        });
    });
};

module.exports = getProviderRides;
