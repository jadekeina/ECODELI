const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getAvailableShopOwnerRequests = require("../../controllers/shopowner_requests/getAvailableShopOwnerRequests");

// Ajout d'un log pour confirmer que ce fichier de route est bien chargé par Express
console.log("✅ Route file 'get.js' loaded for /shopowner-requests/available");

// Utilisez le bon nom de contrôleur dans la route
router.get("/available", auth, getAvailableShopOwnerRequests);

module.exports = router;
