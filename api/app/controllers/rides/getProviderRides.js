const db = require("../../../config/db");

const getProviderRides = async (providerId) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT * FROM rides
      WHERE provider_id = ?
      ORDER BY created_at DESC
    `;

        db.query(query, [providerId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = getProviderRides;
