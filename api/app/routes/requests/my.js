const express = require("express");
const router = express.Router();
const getMyRequests = require("../../controllers/requests/getMyRequests");
const { jsonResponse } = require("../../librairies/response");
const { isGetMethod } = require("../../librairies/method");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return jsonResponse(res, 401, {}, { message: "Token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const data = await getMyRequests(userId);
        return jsonResponse(res, 200, {}, { message: "Demandes récupérées ✅", data });
    } catch (error) {
        console.error("Erreur dans /requests/my :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

module.exports = router;
