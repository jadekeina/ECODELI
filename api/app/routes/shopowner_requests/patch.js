// api/app/routes/shopowner_requests/patch.js
const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const updateShopOwnerRequest = require("../../controllers/shopowner_requests/updateShopOwnerRequest");

router.patch("/:id", auth, updateShopOwnerRequest);
module.exports = router;
