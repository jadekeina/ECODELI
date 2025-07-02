const jwt = require("jsonwebtoken");
const db = require("../../models/shopOwner");
const AddressModel = require("../../models/address");

module.exports = async function updateShopOwner(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const [result] = await db.query("SELECT business_address_id FROM commercants WHERE user_id = ?", [userId]);
        const addressId = result[0]?.business_address_id;

        if (!addressId) throw new Error("Adresse introuvable pour ce commerçant.");

        await new Promise((resolve, reject) => {
            AddressModel.updateAddress(addressId, data.adresse, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await db.query(
            "UPDATE commercants SET nom_entreprise = ?, siret = ? WHERE user_id = ?",
            [data.nom_entreprise, data.siret, userId]
        );

        return { message: "Profil commerçant mis à jour" };
    } catch (err) {
        throw new Error(err.message || "Erreur lors de la mise à jour du commerçant");
    }
};
