const express = require("express");
const router = express.Router();
const { processPendingServicePayments } = require("../../controllers/servicePayments/processServicePayments");

// ⚠️ Ajoute un middleware d’auth admin si besoin
router.get("/trigger-service-payments", async (req, res) => {
    try {
        const result = await processPendingServicePayments();
        res.status(200).json({ message: "Traitement terminé", success: result });
    } catch (err) {
        console.error("Erreur CRON paiement service :", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
