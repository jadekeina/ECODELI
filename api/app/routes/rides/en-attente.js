const express = require("express");
const router = express.Router();
const getRidesEnAttente = require("../../controllers/rides/getRidesEnAttente");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response"); // Réactivé
const auth = require("../../librairies/auth");
const authorizeRoles = require("../../librairies/authorizeRoles");

// GET /rides/en-attente
// Cette route est accessible aux "provider" et "admin" et renvoie TOUTES les courses en attente d'acceptation.
router.get("/", auth, authorizeRoles("provider", "admin"), async (req, res) => {
    if (!isGetMethod(req)) {
        // Pour les erreurs, on peut passer un objet vide pour les headers
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rides = await getRidesEnAttente();

        // --- MODIFICATION CLÉ ICI ---
        // Toutes les données (rides et message) sont maintenant dans le QUATRIÈME argument (body).
        // Le TROISIÈME argument (headers) est un objet vide car nous n'avons pas d'en-têtes HTTP personnalisés à ajouter ici.
        return jsonResponse(res, 200, {}, {
            rides: rides, // Le tableau des courses en attente
            message: "Courses en attente récupérées avec succès pour acceptation."
        });
        // --- FIN MODIFICATION CLÉ ---

    } catch (error) {
        console.error("Erreur récupération rides en attente :", error);
        // Pour les erreurs, on passe aussi un objet vide pour les headers
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
