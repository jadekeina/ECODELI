// models/deliveryDriver.js
const db = require("../../config/db");


exports.createDeliveryDriver = (userId, zone_deplacement, callback) => {
    const sql = `
        INSERT INTO delivery_driver (user_id, zone_deplacement, statut_validation)
        VALUES (?, ?, 'en_attente')
    `;
    db.query(sql, [userId, zone_deplacement], callback);
};


exports.getAllDeliveryDrivers = (callback) => {
    db.query("SELECT * FROM delivery_driver", callback);
};

exports.getDeliveryDriverById = (id, callback) => {
    db.query("SELECT * FROM delivery_driver WHERE id = ?", [id], callback);
};

exports.updateDeliveryDriver = (id, updates, callback) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const sql = `UPDATE delivery_driver SET ${fields} WHERE id = ?`;
    db.query(sql, values, callback);
};

exports.rawQuery = (sql, values, callback) => {
    db.query(sql, values, callback);
};
