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


module.exports = router;
