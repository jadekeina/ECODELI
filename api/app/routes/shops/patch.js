// app/routes/shops/patch.js
const express = require("express");
const router = express.Router();

const updateShop = require("../../controllers/shops/updateShop"); // Chemin vers votre contrôleur updateShop
const auth = require("../../librairies/authMiddleware"); // Chemin vers votre middleware d'authentification
const { isPatchMethod } = require("../../librairies/method"); // Assurez-vous d'avoir isPatchMethod
const { jsonResponse } = require("../../librairies/response"); // Chemin vers votre bibliothèque de réponses

// Route pour modifier une boutique par son ID
// Exemple : PATCH /shops/1
router.patch("/:id", auth, async (req, res) => {
    if (!isPatchMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée." });
    }
    try {
        await updateShop(req, res);
    } catch (err) {
        jsonResponse(res, 500, {}, { message: "Erreur serveur lors de la modification de la boutique.", error: err.message });
    }
});

module.exports = router;
