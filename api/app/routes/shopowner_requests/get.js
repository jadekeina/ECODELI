const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getAllShopOwnerRequests = require("../../controllers/shopowner_requests/getAllShopOwnerRequests");

router.get("/available", auth, getAllShopOwnerRequests);

module.exports = router;
