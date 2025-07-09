const express = require("express");
const router = express.Router();
const createRide = require("../../controllers/rides/createRide");
const payWithStripe = require("../../controllers/payments/payWithStripe"); // ← à ajouter
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    try {
        const ride = await createRide(req.body);
        return jsonResponse(res, 201, {}, { message: "Ride created", ride });
    } catch (error) {
        console.error("Error creating ride:", error);
        return jsonResponse(res, 500, {}, { message: "Internal Server Error", error: error.message });
    }
});


router.post("/:rideId/pay", async (req, res) => {
    try {
        const { rideId } = req.params;

        // ✅ C’est ici qu’on adapte l’appel à ce que le contrôleur attend :
        const result = await payWithStripe({ ride_id: rideId });

        return jsonResponse(res, 200, {}, { message: "Paiement initié", ...result });
    } catch (error) {
        console.error("Erreur paiement Stripe :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur paiement", error: error.message });
    }
});


module.exports = router;
