const express = require("express");
const router = express.Router();
const getRidesEnAttente = require("../../controllers/rides/getRidesEnAttente");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const auth = require("../../librairies/auth");
const authorizeRoles = require("../../librairies/authorizeRoles");

router.get("/", auth, authorizeRoles("provider", "admin"), async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rides = await getRidesEnAttente();
        return jsonResponse(res, 200, {}, { message: "Courses en attente récupérées", rides });
    } catch (error) {
        console.error("Erreur récupération rides en attente :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;

