const express = require("express");
const router = express.Router();
const assignProviderToRide = require("../../controllers/rides/assignProviderToRide");
const auth = require("../../librairies/auth");
const authorizeRoles = require("../../librairies/authorizeRoles");
const { isPatchMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.patch(
    "/:id/assign",
    auth,
    authorizeRoles("provider", "admin"),
    async (req, res) => {
        if (!isPatchMethod(req)) {
            return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
        }

        const rideId = req.params.id;
        const providerId = req.user.id;

        try {
            const result = await assignProviderToRide(rideId, providerId);
            return jsonResponse(res, 200, {}, { message: "Course assignée ✅", result });
        } catch (error) {
            console.error("Erreur assignation chauffeur :", error);
            return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
        }
    }
);

module.exports = router;
