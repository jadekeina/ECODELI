const database = require("../../../config/db");

module.exports = (req, res) => {
    const userId = req.user.id;

    database.query("SELECT id FROM delivery_driver WHERE user_id = ?", [userId], (err, driverRows) => {
        if (err) {
            console.error("Erreur requête delivery_driver :", err);
            return res.status(500).json({ message: "Erreur serveur", error: err.message });
        }

        const driver = driverRows[0];
        if (!driver) {
            return res.status(404).json({ message: "Livreur introuvable." });
        }

        database.query(
            `SELECT d.id, d.shopowner_request_id, d.montant, d.statut, d.created_at, s.price, s.status AS request_status
             FROM delivery_driver_payments d
                      JOIN shopowner_requests s ON d.shopowner_request_id = s.id
             WHERE d.delivery_driver_id = ?`,
            [driver.id],
            (err2, paymentsRows) => {
                if (err2) {
                    console.error("Erreur requête paiements :", err2);
                    return res.status(500).json({ message: "Erreur serveur", error: err2.message });
                }

                res.status(200).json({ payments: paymentsRows });
            }
        );
    });
};
