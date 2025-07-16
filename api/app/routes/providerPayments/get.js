const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const getProviderPayments = require("../../controllers/providerPayments/getProviderPayments");

router.get("/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const providerId = req.params.id;
        const payments = await getProviderPayments(providerId);
        return jsonResponse(res, 200, { payments }, { message: "Paiements du prestataire" });
    } catch (error) {
        console.error("Erreur récupération paiements prestataire:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
