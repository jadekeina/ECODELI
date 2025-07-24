const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getMyShops = require("../../controllers/shops/getMyShops");

router.get("/mine", auth, getMyShops);

module.exports = router;
