const express = require("express");
const router = express.Router();
const getShopOwnerRequestById = require("../../controllers/shopowner_requests/getShopOwnerRequestById");
const userIsLoggedIn = require("../../librairies/user-is-logged-in"); // middleware déjà existant chez toi

router.get("/:id", userIsLoggedIn, getShopOwnerRequestById);

module.exports = router;
