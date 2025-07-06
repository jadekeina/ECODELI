const express = require("express");
const router = express.Router();
const createPaymentIntent = require("../../controllers/payments/createPaymentIntent");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const { type, data } = req.body;

        if (!data || !data.ride_id) {
            return jsonResponse(res, 400, {}, { message: "Champ ride_id requis" });
        }

        const paymentIntent = await createPaymentIntent({ type, data });
        return jsonResponse(
            res,
            201,
            {},
            {
                message: "PaymentIntent créé",
                client_secret: paymentIntent.client_secret,
            }
        );
    } catch (error) {
        console.error("Erreur création PaymentIntent :", error);
        const status = error.status || 500;
        return jsonResponse(res, status, {}, {
            message: "Erreur serveur lors du paiement",
            error: error.message,
        });
    }
});

module.exports = router;
