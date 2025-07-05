const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../../librairies/response");
const userModel = require("../../models/users");

router.get("/:token", async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return jsonResponse(res, 400, {}, { message: "Token manquant" });
    }

    // Rechercher l'utilisateur correspondant au token
    userModel.getUserByToken(token, (err, results) => {
        if (err) {
            console.error("Erreur DB :", err);
            return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
        }

        if (results.length === 0) {
            return jsonResponse(res, 404, {}, { message: "Lien invalide ou expiré" });
        }

        const user = results[0];

        // Mettre le token à NULL = confirmation du compte
        userModel.clearUserToken(user.id, (updateErr) => {
            if (updateErr) {
                return jsonResponse(res, 500, {}, { message: "Erreur lors de la validation" });
            }

            return jsonResponse(res, 200, {}, { message: "Email confirmé avec succès" });
        });
    });
});

module.exports = router;
