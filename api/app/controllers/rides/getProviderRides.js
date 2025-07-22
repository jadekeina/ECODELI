const db = require("../../../config/db");

const getProviderRides = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.* FROM rides r
            JOIN provider p ON p.id = r.provider_id
            WHERE p.user_id = ?
            ORDER BY r.created_at DESC
        `;
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("[getProviderRides] Erreur SQL :", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = getProviderRides;

