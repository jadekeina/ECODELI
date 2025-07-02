// models/shopOwner.js
const db = require("../../config/db");

exports.createShopOwner = (userId, nom_entreprise, siret, business_address_id, callback) => {
    const sql = `
        INSERT INTO shop_owner
        (user_id, nom_entreprise, siret, business_address_id, statut_validation)
        VALUES (?, ?, ?, ?, 'en_attente')`;

    db.query(sql, [userId, nom_entreprise, siret, business_address_id], callback);
};

exports.getAllShopOwners = (callback) => {
    db.query("SELECT * FROM shop_owner", callback);
};

exports.getShopOwnerById = (id, callback) => {
    db.query("SELECT * FROM shop_owner WHERE id = ?", [id], callback);
};

exports.getShopOwnerByUserId = (userId, callback) => {
    db.query("SELECT * FROM shop_owner WHERE user_id = ?", [userId], callback);
};

exports.updateShopOwner = (id, updates, callback) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const sql = `UPDATE shop_owner SET ${fields} WHERE id = ?`;
    db.query(sql, values, callback);
};

exports.rawQuery = (sql, values, callback) => {
    db.query(sql, values, callback);
};
