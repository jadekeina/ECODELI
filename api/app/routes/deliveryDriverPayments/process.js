// routes/deliveryDriverPayments/process.js
const express = require("express");
const router = express.Router();
const processPayments = require("../../controllers/deliveryDriverPayments/processDeliveryDriverPayments");

router.post("/process", processPayments);

module.exports = router;
