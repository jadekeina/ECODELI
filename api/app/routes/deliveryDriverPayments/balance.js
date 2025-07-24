const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getBalance = require("../../controllers/deliveryDriverPayments/getBalance");

router.get("/", auth, getBalance);

module.exports = router;
