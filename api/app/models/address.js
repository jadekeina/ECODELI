const db = require("../../config/db");

module.exports = {
    insertAddress: (fullAddress, callback) => {
        const sql = "INSERT INTO addresses (full_address) VALUES (?)";
        db.query(sql, [fullAddress], callback);
    }
};
