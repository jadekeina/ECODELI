const db = require("../../../config/db");

const getRequestsByProvider = async (providerId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*
            FROM requests r
            JOIN provider p ON p.user_id = r.user_id
            WHERE p.id = ?
            ORDER BY r.created_at DESC
        `;

        db.query(query, [providerId], (err, results) => {
            if (err) {
                console.error("[getRequestsByProvider] Erreur SQL:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = getRequestsByProvider;
