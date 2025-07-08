const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../../librairies/response");
const sendResetPassword = require("../../controllers/auth/sendResetPassword");
const { isPostMethod } = require("../../librairies/method");

router.post("/", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    const { mail } = req.body;

    if (!mail) {
        return jsonResponse(res, 400, {}, { message: "Adresse mail manquante" });
    }

    try {
        await sendResetPassword(mail);
        return jsonResponse(res, 200, {}, { message: "Lien envoyé" });
    } catch (error) {
        return jsonResponse(res, 404, {}, { message: error.message });
    }
});

module.exports = router;
