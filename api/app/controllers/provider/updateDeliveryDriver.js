// controllers/provider/updateProvider.js
const jwt = require("jsonwebtoken");
const model = require("../../models/provider");

async function updateProvider(token, updates) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM prestataires WHERE user_id = ?";
            model.rawQuery(sql, [userId], (err, result) => {
                if (err || result.length === 0) return reject(new Error("Provider profile not found"));

                const providerId = result[0].id;
                model.updateProvider(providerId, updates, (err2) => {
                    if (err2) return reject(err2);
                    resolve({ message: "Provider profile updated" });
                });
            });
        });
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = updateProvider;
