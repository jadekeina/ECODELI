const db = require("../../../config/db");

const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer l'id du livreur
        const [driverRows] = await db.query(
            "SELECT id FROM delivery_driver WHERE user_id = ?",
            [userId]
        );

        if (driverRows.length === 0) {
            return res.status(404).json({ message: "Livreur non trouvé" });
        }

        const deliveryDriverId = driverRows[0].id;

        // Calculer le solde total validé
        const [balanceRows] = await db.query(
            "SELECT SUM(amount) AS balance FROM delivery_driver_payments WHERE delivery_driver_id = ? AND status = 'validé'",
            [deliveryDriverId]
        );

        const balance = balanceRows[0].balance || 0;

        res.json({ balance });
    } catch (error) {
        console.error("Erreur getBalance:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = getBalance;
