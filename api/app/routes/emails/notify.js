// Fichier : app/routes/emails/notify.js

const express = require("express");
const router = express.Router();
const sendConfirmationEmail = require("../../controllers/emails/sendConfirmationEmail");


router.post("/:type/:id/notify", async (req, res) => {
    const { type, id } = req.params;

    try {
        await sendConfirmationEmail(type, id);
        return res.status(200).json({ message: `Email envoyé pour ${type} #${id}` });
    } catch (error) {
        console.error("Erreur envoi email :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;