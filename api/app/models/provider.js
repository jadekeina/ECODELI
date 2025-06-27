// models/provider.js
const db = require("../../config/db");


exports.insertProvider = (userId, type_prestation, zone_deplacement, callback) => {
    const sql = `
        INSERT INTO provider (user_id, type_prestation, zone_deplacement, statut_validation)
        VALUES (?, ?, ?, 'en_attente')
    `;
    db.query(sql, [userId, type_prestation, zone_deplacement], callback);
};


exports.getAllProviders = (callback) => {
    db.query("SELECT * FROM provider", callback);
};

exports.getProviderById = (id, callback) => {
    db.query("SELECT * FROM provider WHERE id = ?", [id], callback);
};

exports.updateProvider = (id, updates, callback) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const sql = `UPDATE provider SET ${fields} WHERE id = ?`;
    db.query(sql, values, callback);
};

exports.rawQuery = (sql, values, callback) => {
    db.query(sql, values, callback);
};
