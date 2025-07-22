const jwt = require("jsonwebtoken");
const db = require("../../../config/db");
const Shop = require("../../models/shop");

async function createShop(token, data) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const { name, address } = data;
    if (!name || !address) {
        throw new Error("Champs requis manquants.");
    }

    // Récupérer shop_owner.id depuis userId
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

    // Créer la boutique
    const shopId = await Shop.create({ shop_owner_id: shopOwnerId, name, address });

    return { message: "Boutique créée avec succès", shopId };
}

module.exports = createShop;
