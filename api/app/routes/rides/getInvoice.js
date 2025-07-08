const express = require("express");
const router = express.Router();
const generateInvoice = require("../../controllers/invoices/generateInvoice");
const { jsonResponse } = require("../../librairies/response");

router.get("/:id/invoice", async (req, res) => {
    const { id } = req.params;

    try {
        const invoicePath = await generateInvoice(id);
        return jsonResponse(res, 200, {}, {
            message: "Facture générée",
            invoice_url: invoicePath,
        });
    } catch (error) {
        console.error("Erreur génération facture :", error);
        return jsonResponse(res, 500, {}, {
            message: "Erreur génération facture",
            error: error.message,
        });
    }
});

module.exports = router;
