const db = require("../../config/db");

module.exports = {
    insertAddress: (fullAddress, callback) => {
        const sql = "INSERT INTO addresses (full_address) VALUES (?)";
        db.query(sql, [fullAddress], callback);
    },

    updateAddress: (addressId, newAddress, callback) => {
        const sql = "UPDATE addresses SET full_address = ? WHERE id = ?";
        db.query(sql, [newAddress, addressId], callback);
    }
};
