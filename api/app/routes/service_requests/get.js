// routes/service_requests/get.js
// Ce routeur gère les routes GET pour les demandes de service.

const express = require("express");
const router = express.Router();

const getServiceRequestById = require("../../controllers/service_requests/getServiceRequestById"); // Chemin vers votre contrôleur
const auth = require("../../librairies/authMiddleware"); // Chemin vers votre middleware d'authentification
const { isGetMethod } = require("../../librairies/method"); // Chemin vers votre bibliothèque de méthodes HTTP
// Importez uniquement jsonResponse de votre bibliothèque de réponses
const { jsonResponse } = require("../../librairies/response"); // Assurez-vous que ce chemin est correct

// Définit la route GET pour récupérer une demande par son ID
// Exemple d'utilisation : GET /api/service_requests/5 (si ce routeur est monté sur '/api/service_requests')
router.get("/:id", auth, async (req, res) => {
    // Vérifie si la méthode HTTP est bien GET
    if (!isGetMethod(req)) {
        // Utilisation de jsonResponse pour une méthode non autorisée (405)
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée." });
    }
    try {
        // Appelle le contrôleur pour gérer la requête
        await getServiceRequestById(req, res);
    } catch (err) {
        // Gère les erreurs internes du serveur
        // Utilisation de jsonResponse pour une erreur interne du serveur (500)
        jsonResponse(res, 500, {}, { message: "Erreur serveur.", error: err.message });
    }
});

module.exports = router;
