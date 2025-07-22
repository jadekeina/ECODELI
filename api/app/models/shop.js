const db = require("../../config/db");

const Shop = {
    create: ({ shop_owner_id, name, address }) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO shops (shop_owner_id, name, address) VALUES (?, ?, ?)`,
                [shop_owner_id, name, address],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result.insertId);
                }
            );
        });
    },

    findAllByShopOwnerId: (shopOwnerId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM shops WHERE shop_owner_id = ?`,
                [shopOwnerId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    },
};

module.exports = Shop;
