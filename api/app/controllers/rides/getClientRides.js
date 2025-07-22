const db = require("../../../config/db");

const getClientRides = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT * FROM rides WHERE user_id = ? ORDER BY scheduled_date DESC
    `;
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = getClientRides;
