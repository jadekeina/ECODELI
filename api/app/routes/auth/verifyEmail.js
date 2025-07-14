const express = require("express");
const router = express.Router();
const userModel = require("../../models/users");

router.get("/:token", async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).send("Token manquant");
    }

    userModel.getUserByEmailToken(token, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send("Lien invalide ou expiré.");
        }

        const user = results[0];

        userModel.clearUserEmailToken(user.id, (updateErr) => {
            if (updateErr) {
                return res.status(500).send("Erreur lors de la validation.");
            }

            // 🔁 Redirection vers le frontend après validation
            return res.redirect(`${process.env.BASE_URL}/email-confirmed/${token}`);
        });
    });
});

module.exports = router;
