const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const { isGetMethod } = require("../../librairies/method");
// Nous n'utiliserons pas jsonResponse pour le corps des données ici,
// car il semble mal gérer l'inclusion des objets dans le corps.
// const { jsonResponse } = require("../../librairies/response");

const getProviderRides = require("../../controllers/rides/getProviderRides"); // Assurez-vous que le chemin est correct

// GET /rides/provider/:id
router.get("/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) {
        // Pour les erreurs, jsonResponse peut encore être utile si sa gestion des messages est bonne
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    try {
        const userId = req.params.id;
        const rides = await getProviderRides(userId);

        // --- MODIFICATION CLÉ ICI ---
        // Utilisez res.status().json() directement pour envoyer le corps JSON.
        // Cela garantit que 'rides' est bien dans le corps de la réponse.
        return res.status(200).json({
            rides: rides, // Le tableau des trajets
            message: "Trajets du prestataire récupérés avec succès" // Un message optionnel
        });
        // --- FIN MODIFICATION CLÉ ---

    } catch (error) {
        console.error("Erreur récupération trajets prestataire:", error);
        // Pour les erreurs, utilisez aussi res.status().json() pour une cohérence
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
