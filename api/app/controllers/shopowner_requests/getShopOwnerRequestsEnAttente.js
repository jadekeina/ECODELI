// controllers/shopownerRequests/getShopOwnerRequestsEnAttente.js
const db = require("../../../config/db");

module.exports = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT s.*, sh.name AS shop_name, sh.address AS shop_address
            FROM shopowner_requests s
            LEFT JOIN shops sh ON s.shop_id = sh.id
            WHERE s.statut = 'en_attente'
            ORDER BY s.date DESC
        `;
        db.query(query, (err, rows) => {
            if (err) {
                console.error("❌ [getShopOwnerRequestsEnAttente] Erreur SQL :", err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};
