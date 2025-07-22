const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const getRequestsByProvider = require("../../controllers/requests/getRequestsByProvider");

router.get("/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const providerId = req.params.id;
        const requests = await getRequestsByProvider(providerId);
        return jsonResponse(res, 200, { requests }, { message: "Requêtes du prestataire" });
    } catch (error) {
        console.error("Erreur récupération requêtes prestataire:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
