// backend/routes/delivery_drivers/driverByUserIdRoute.js
const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth"); // Assurez-vous que le chemin est correct
const getDriverByUserId = require("../../controllers/deliveryDriver/getDriverByUserId"); // Assurez-vous que le chemin est correct

// Définition de la route unique pour récupérer un livreur par son user_id
// Cette route sera montée sous un préfixe dans app.js (par exemple, /delivery-drivers)
// Donc, l'URL complète sera par exemple /delivery-drivers/by-user/:userId
router.get("/by-user/:userId", auth, getDriverByUserId);

module.exports = router;
