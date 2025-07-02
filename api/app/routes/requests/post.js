const express = require("express");
const router = express.Router();

const postRequest = require("../../controllers/requests/postRequest");
const verifyToken = require("../../librairies/authMiddleware");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", verifyToken, async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        await postRequest(req, res);
    } catch (error) {
        console.error("Erreur dans la route /requests :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

module.exports = router;
