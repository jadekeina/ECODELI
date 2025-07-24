const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth"); // Assurez-vous que c'est bien votre middleware d'authentification
const getMyShopOwnerRequests = require("../../controllers/shopowner_requests/getMyShopOwnerRequests");

router.get("/mine", auth, getMyShopOwnerRequests);

module.exports = router;
