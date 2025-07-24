const db = require("../../../config/db");

module.exports = async ({ delivery_driver_id, request_id, amount }) => {
    try {
        await db.promise().query(
            `INSERT INTO delivery_driver_payments (delivery_driver_id, request_id, amount) VALUES (?, ?, ?)`,
            [delivery_driver_id, request_id, amount]
        );

        await db.promise().query(
            `UPDATE delivery_driver SET solde = solde + ? WHERE id = ?`,
            [amount, delivery_driver_id]
        );
    } catch (error) {
        console.error("Erreur ajout paiement livreur:", error);
        throw new Error("Échec du traitement du paiement livreur");
    }
};
