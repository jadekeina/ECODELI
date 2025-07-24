// routes/payments/service.js
const express = require("express");
const router = express.Router();
const auth = require("../../librairies/authMiddleware");
const db = require("../../../config/db");

// Middleware pour restreindre l'accès aux prestataires eux-mêmes
const getProviderIdFromUserId = async (userId) => {
    const [[row]] = await db.promise().query(
        `SELECT id FROM provider WHERE user_id = ?`,
        [userId]
    );
    return row?.id || null;
};

// 🔐 GET /payments/service/balance/:userId
router.get("/balance/:userId", auth, async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (req.user.id !== userId) {
        return res.status(403).json({ message: "Accès interdit." });
    }

    try {
        const providerId = await getProviderIdFromUserId(userId);
        if (!providerId) {
            return res.status(404).json({ message: "Prestataire introuvable." });
        }

        const [[row]] = await db.promise().query(
            `SELECT COALESCE(SUM(amount), 0) AS balance FROM service_payments WHERE provider_id = ? AND status = 'effectue'`,
            [providerId]
        );

        return res.status(200).json({ balance: row.balance });
    } catch (err) {
        console.error("Erreur balance service:", err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
