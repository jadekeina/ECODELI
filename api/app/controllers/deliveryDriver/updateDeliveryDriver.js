// controllers/deliveryDriver/updateDeliveryDriver.js
const jwt = require("jsonwebtoken");
const model = require("../../models/deliveryDriver");

async function updateDeliveryDriver(token, updates) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        // Récupérer l'ID du livreur via userId
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM livreurs WHERE user_id = ?";
            model.rawQuery(sql, [userId], (err, result) => {
                if (err || result.length === 0) return reject(new Error("Profil non trouvé"));

                const livreurId = result[0].id;

                model.updateDeliveryDriver(livreurId, updates, (err2) => {
                    if (err2) return reject(err2);
                    resolve({ message: "Delivery driver profile updated" });
                });
            });
        });
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = updateDeliveryDriver;
