// controllers/shopOwner/createShopOwner.js
const jwt = require("jsonwebtoken");
const model = require("../../models/shopOwner");

async function createShopOwner(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const sql = `INSERT INTO commercants (user_id, nom_entreprise, siret, statut_validation)
                 VALUES (?, ?, ?, ?)`;
        const values = [
            userId,
            data.nom_entreprise || null,
            data.siret || null,
            "en_attente"
        ];

        return new Promise((resolve, reject) => {
            model.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve({ message: "Shop owner profile created successfully" });
            });
        });
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = createShopOwner;
