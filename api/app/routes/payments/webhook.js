const express = require("express");
const router = express.Router();
const handleStripeWebhook = require("../../controllers/payments/handleStripeWebhook");

router.post("/", handleStripeWebhook);

module.exports = router;
