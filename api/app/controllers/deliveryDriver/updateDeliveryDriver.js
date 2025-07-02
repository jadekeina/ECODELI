const jwt = require("jsonwebtoken");
const db = require("../../models/deliveryDriver");
const AddressModel = require("../../models/address");

module.exports = async function updateDeliveryDriver(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        // Récupère l'adresse liée
        const [result] = await db.query("SELECT zone_address_id FROM livreurs WHERE user_id = ?", [userId]);
        const addressId = result[0]?.zone_address_id;

        if (!addressId) throw new Error("Adresse introuvable pour ce livreur.");

        await new Promise((resolve, reject) => {
            AddressModel.updateAddress(addressId, data.zone_deplacement, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        return { message: "Adresse du livreur mise à jour" };
    } catch (err) {
        throw new Error(err.message || "Erreur lors de la mise à jour du livreur");
    }
};
