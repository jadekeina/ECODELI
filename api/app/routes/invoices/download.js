const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();

const generateInvoice = require("../../controllers/invoices/generateInvoice");

router.get("/download", (req, res) => {
    const { type, id } = req.query;

    if (!type || !id) {
        return res.status(400).json({ error: "Paramètres manquants (type, id)" });
    }

    const filename = `service-${id}.pdf`;
    const filePath = path.resolve(__dirname, `../../../storage/invoices/${filename}`);

    if (fs.existsSync(filePath)) {
        return res.download(filePath, filename);
    }

    generateInvoice({ type, id }, (err, outputPath) => {
        if (err) {
            console.error("❌ Erreur génération facture :", err.message);
            return res.status(500).json({ error: "Erreur serveur lors du téléchargement." });
        }

        res.download(outputPath, filename);
    });
});

module.exports = router;
