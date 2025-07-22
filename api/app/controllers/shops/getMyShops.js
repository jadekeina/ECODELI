const jwt = require("jsonwebtoken");
const db = require("../../../config/db");
const Shop = require("../../models/shop");

async function getShops(token) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Vérifier si l'utilisateur est bien un shop-owner
    const shopOwnerId = await new Promise((resolve, reject) => {
        db.query(
            "SELECT id FROM shop_owner WHERE user_id = ?",
            [userId],
            (err, results) => {
                if (err) return reject(err);
                if (!results[0]) return reject(new Error("Profil commerçant introuvable."));
                resolve(results[0].id);
            }
        );
    });

    const shops = await Shop.findAllByShopOwnerId(shopOwnerId);
    return shops;
}

module.exports = getShops;
