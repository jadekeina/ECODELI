const jwt = require("jsonwebtoken");
const db = require("../../models/provider");
const AddressModel = require("../../models/address");

module.exports = async function updateProvider(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const [result] = await db.query("SELECT zone_address_id FROM prestataires WHERE user_id = ?", [userId]);
        const addressId = result[0]?.zone_address_id;

        if (!addressId) throw new Error("Adresse introuvable pour ce prestataire.");

        await new Promise((resolve, reject) => {
            AddressModel.updateAddress(addressId, data.zone_deplacement, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await db.query(
            "UPDATE prestataires SET type_prestation = ?, diplome = ? WHERE user_id = ?",
            [data.type_prestation, data.diplome, userId]
        );

        return { message: "Profil prestataire mis à jour" };
    } catch (err) {
        throw new Error(err.message || "Erreur lors de la mise à jour du prestataire");
    }
};
