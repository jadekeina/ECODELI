const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const deleteShopOwnerRequest = require("../../controllers/shopowner_requests/deleteShopOwnerRequest");

// CORRECTION ICI : Le chemin de la route doit être "/:id"
// Car ce routeur sera monté sous "/shopowner-requests" dans app.js
router.delete("/:id", auth, deleteShopOwnerRequest);

module.exports = router;
