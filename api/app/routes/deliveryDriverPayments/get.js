const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getDeliveryDriverPayments = require("../../controllers/deliveryDriverPayments/getDeliveryDriverPayments");

router.get("/", auth, async (req, res) => {
    try {
        await getDeliveryDriverPayments(req, res);
    } catch (error) {
        console.error("Erreur GET /delivery-driver/payments :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        await getDeliveryDriverPayments(req, res);
    } catch (error) {
        console.error("Erreur GET /delivery-driver/payments :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});


module.exports = router;
