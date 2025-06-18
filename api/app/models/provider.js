// models/provider.js
const db = require("../../config/db");

exports.createProvider = (userId, type, diploma, zone, callback) => {
    const sql = `INSERT INTO prestataires (user_id, type_prestation, diplome, zone_deplacement, statut_validation)
               VALUES (?, ?, ?, ?, 'en_attente')`;
    db.query(sql, [userId, type, diploma, zone], callback);
};

exports.getAllProviders = (callback) => {
    db.query("SELECT * FROM prestataires", callback);
};

exports.getProviderById = (id, callback) => {
    db.query("SELECT * FROM prestataires WHERE id = ?", [id], callback);
};

exports.updateProvider = (id, updates, callback) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const sql = `UPDATE prestataires SET ${fields} WHERE id = ?`;
    db.query(sql, values, callback);
};

exports.rawQuery = (sql, values, callback) => {
    db.query(sql, values, callback);
};
