const jwt = require("jsonwebtoken");
const db = require("../../config/db");

async function createProvider(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const sql = `INSERT INTO prestataires (user_id, type_prestation, diplome, zone_deplacement, statut_validation)
                 VALUES (?, ?, ?, ?, ?)`;
        const values = [
            userId,
            data.type_prestation || null,
            data.diplome || null,
            data.zone_deplacement || null,
            "en_attente"
        ];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve({ message: "Provider profile created successfully" });
            });
        });
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = createProvider;
