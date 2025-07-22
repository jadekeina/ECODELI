const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const getClientRides = require("../../controllers/rides/getClientRides");

// GET /rides/client/me
router.get("/me", auth, async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const userId = req.user.id; // Récupéré via auth middleware
        const rides = await getClientRides(userId);
        return jsonResponse(res, 200, {}, { message: "Trajets du client récupérés", rides });
    } catch (error) {
        console.error("Erreur récupération trajets client :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
