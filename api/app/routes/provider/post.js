const express = require("express");
const router = express.Router();
const multer = require("multer");
const createProvider = require("../../controllers/provider/createProvider");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

const upload = multer().none();

router.post("/", upload, async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponse(res, 401, {}, { message: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const result = await createProvider(token, req.body);
        return jsonResponse(res, 201, {}, result);
    } catch (err) {
        console.error(err);
        return jsonResponse(res, 500, {}, { message: err.message || "Erreur serveur" });
    }
});

module.exports = router;
