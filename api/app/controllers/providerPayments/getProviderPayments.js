const db = require("../../../config/db");

const getProviderPayments = async (providerId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM provider_payments
            WHERE provider_id = ?
            ORDER BY created_at DESC
        `;

        db.query(query, [providerId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = getProviderPayments;
