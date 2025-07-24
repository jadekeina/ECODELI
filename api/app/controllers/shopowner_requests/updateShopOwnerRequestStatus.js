// controllers/shopowner_requests/updateShopOwnerRequestStatus.js
const db = require("../../../config/db");

module.exports = async (req, res) => {
    const { id } = req.params;
    // Récupère 'status' et 'delivery_driver_id' du corps de la requête
    const { status, delivery_driver_id: payload_delivery_driver_id } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Statut manquant." });
    }

    let query = "UPDATE shopowner_requests SET statut = ?";
    let params = [status];

    // Logique pour gérer le delivery_driver_id en fonction du statut
    if (status === "en_cours") {
        // Pour "en_cours", on s'attend à recevoir l'ID du livreur dans le payload
        if (payload_delivery_driver_id === undefined || payload_delivery_driver_id === null) {
            console.error("❌ [updateShopOwnerRequestStatus] delivery_driver_id manquant pour statut 'en_cours'.");
            return res.status(400).json({ message: "ID du livreur manquant pour le statut 'en_cours'." });
        }
        query += ", delivery_driver_id = ?";
        params.push(payload_delivery_driver_id); // Utilise l'ID du livreur du payload
    } else if (status === "ignoree" || status === "annulee") {
        // Pour "ignoree" ou "annulee", l'ID du livreur doit être mis à NULL
        query += ", delivery_driver_id = NULL";
    }
    // Pour le statut "terminee" (et tout autre statut non listé),
    // nous NE modifions PAS explicitement delivery_driver_id dans la requête.
    // Cela signifie que sa valeur actuelle dans la base de données sera CONSERVÉE.

    query += " WHERE id = ?";
    params.push(id);

    // Exécute la requête SQL en l'enveloppant dans une Promise
    try {
        await new Promise((resolve, reject) => {
            db.query(query, params, (err, result) => {
                if (err) {
                    console.error("❌ [updateShopOwnerRequestStatus] Erreur SQL :", err);
                    return reject(err);
                }
                resolve(result);
            });
        });
        console.log(`✅ Statut de la demande ${id} mis à jour à '${status}' avec succès.`);
        res.status(200).json({ message: "Statut mis à jour avec succès." });
    } catch (error) {
        console.error("❌ Erreur serveur lors de la mise à jour du statut :", error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour.", error: error.message });
    }
};
