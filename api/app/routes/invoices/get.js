// Fichier : app/routes/invoices/getId.js
const express = require("express");
const router = express.Router();
const generateInvoice = require("../../controllers/invoices/generateInvoice");

router.get("/:type/:id", async (req, res) => {
    const { type, id } = req.params;

    try {
        const filePath = await generateInvoice(type, id);
        return res.download(filePath);
    } catch (error) {
        console.error("Erreur génération facture :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;