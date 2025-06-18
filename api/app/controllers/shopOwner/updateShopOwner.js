// controllers/shopOwner/updateShopOwner.js
const jwt = require("jsonwebtoken");
const model = require("../../models/shopOwner");

async function updateShopOwner(token, updates) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM commercants WHERE user_id = ?";
            model.rawQuery(sql, [userId], (err, result) => {
                if (err || result.length === 0) return reject(new Error("Shop owner profile not found"));

                const shopOwnerId = result[0].id;
                model.updateShopOwner(shopOwnerId, updates, (err2) => {
                    if (err2) return reject(err2);
                    resolve({ message: "Shop owner profile updated" });
                });
            });
        });
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = updateShopOwner;
