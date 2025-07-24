// Fichier : app/routes/rides/status.js
const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth"); // Votre middleware d'authentification
const { isPatchMethod } = require("../../librairies/method"); // Pour vérifier la méthode
// Importez le contrôleur. Il est maintenant conçu pour être un middleware Express.
const updateRideStatusController = require("../../controllers/rides/updateRideStatus"); // Renommé pour éviter la confusion

// PATCH /rides/:id/status
// Cette route va déléguer la gestion complète de la requête au contrôleur.
router.patch("/:id/status", auth, async (req, res) => {
    // La vérification de la méthode peut rester ici si vous le souhaitez,
    // ou être déplacée dans le contrôleur si vous préférez.
    if (!isPatchMethod(req)) {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    // Appelez le contrôleur directement, en lui passant req et res.
    // Le contrôleur est maintenant responsable de lire req.params.id, req.body,
    // et d'envoyer la réponse (res.status().json()).
    try {
        await updateRideStatusController(req, res);
    } catch (error) {
        // En cas d'erreur non gérée par le contrôleur lui-même (ce qui ne devrait pas arriver
        // car le contrôleur envoie déjà une réponse d'erreur),
        // ou si un middleware précédent lève une erreur.
        console.error("Erreur inattendue dans la route PATCH /rides/:id/status:", error);
        if (!res.headersSent) { // S'assurer que la réponse n'a pas déjà été envoyée
            res.status(500).json({ message: "Erreur serveur inattendue.", error: error.message });
        }
    }
});

module.exports = router;
