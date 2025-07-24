const express = require("express");
const router = express.Router();
const loginAdmin = require("../../controllers/auth/loginAdmin");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const { mail, password } = req.body;

        const admin = await loginAdmin(mail, password);

        return jsonResponse(res, 200, {}, {
            message: "Connexion admin réussie",
            user: admin,
        });
    } catch (error) {
        return jsonResponse(res, 401, {}, { message: error.message });
    }
});

module.exports = router;
