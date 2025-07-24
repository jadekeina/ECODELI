// app/routes/shops/get.js
const express = require("express");
const router = express.Router();

const getShopById = require("../../controllers/shops/getShopById"); // Chemin vers votre contrôleur getShopById
const auth = require("../../librairies/authMiddleware"); // Chemin vers votre middleware d'authentification
const { isGetMethod } = require("../../librairies/method"); // Chemin vers votre bibliothèque de méthodes HTTP
const { jsonResponse } = require("../../librairies/response"); // Chemin vers votre bibliothèque de réponses

// Route pour récupérer une boutique par son ID
// Exemple : GET /shops/1
router.get("/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée." });
    }
    try {
        await getShopById(req, res);
    } catch (err) {
        jsonResponse(res, 500, {}, { message: "Erreur serveur lors de la récupération de la boutique.", error: err.message });
    }
});

module.exports = router;
