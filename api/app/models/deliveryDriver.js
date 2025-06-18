// models/deliveryDriver.js
const db = require("../../config/db");

exports.createDeliveryDriver = (userId, zone, callback) => {
    const sql = `INSERT INTO livreurs (user_id, zone_deplacement, statut_validation) VALUES (?, ?, 'en_attente')`;
    db.query(sql, [userId, zone], callback);
};

exports.getAllDeliveryDrivers = (callback) => {
    db.query("SELECT * FROM livreurs", callback);
};

exports.getDeliveryDriverById = (id, callback) => {
    db.query("SELECT * FROM livreurs WHERE id = ?", [id], callback);
};

exports.updateDeliveryDriver = (id, updates, callback) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const sql = `UPDATE livreurs SET ${fields} WHERE id = ?`;
    db.query(sql, values, callback);
};

exports.rawQuery = (sql, values, callback) => {
    db.query(sql, values, callback);
};
