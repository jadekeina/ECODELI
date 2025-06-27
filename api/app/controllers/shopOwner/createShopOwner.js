// controllers/shopOwner/createShopOwner.js
const jwt = require("jsonwebtoken");
const db = require("../../models/provider");
const AddressModel = require("../../models/address");

async function createShopOwner(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        return new Promise((resolve, reject) => {
            const { nom_entreprise, siret, adresse } = data;

            if (!nom_entreprise || !siret || !adresse) {
                return reject(new Error("Champs 'nom_entreprise', 'siret' ou 'adresse' manquants"));
            }

            AddressModel.insertAddress(adresse, (err, addressResult) => {
                if (err) return reject(err);

                const businessAddressId = addressResult.insertId;

                db.query(
                    `INSERT INTO shop_owner (user_id, business_address_id) VALUES (?, ?)`,
                    [userId, businessAddressId],
                    (err2) => {
                        if (err2) return reject(err2);
                        resolve({ message: "Profil commerçant créé avec succès" });
                    }
                );
            });
        });
    } catch (err) {
        throw new Error("Token invalide ou expiré");
    }
}

module.exports = createShopOwner;
