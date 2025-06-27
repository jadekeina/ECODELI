const express = require("express");
const router = express.Router();
const multer = require("multer");
const createDeliveryDriver = require("../../controllers/deliveryDriver/createDeliveryDriver");
const updateDeliveryDriver = require("../../controllers/deliveryDriver/updateDeliveryDriver");
const { isPostMethod, isPatchMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

const upload = multer().none(); // Pas de fichiers ici, uniquement des champs texte

// Création d'un profil chauffeur
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
        const result = await createDeliveryDriver(token, req.body);
        return jsonResponse(res, 201, {}, result);
    } catch (err) {
        console.error("Erreur serveur lors de la création du chauffeur:", err);
        return jsonResponse(res, 500, {}, { message: err.message || "Erreur serveur" });
    }
});

// Mise à jour du profil chauffeur
router.patch("/", upload, async (req, res) => {
    if (!isPatchMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponse(res, 401, {}, { message: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const result = await updateDeliveryDriver(token, req.body);
        return jsonResponse(res, 200, {}, result);
    } catch (err) {
        console.error("Erreur serveur lors de la mise à jour du chauffeur:", err);
        return jsonResponse(res, 500, {}, { message: err.message || "Erreur serveur" });
    }
});

module.exports = router;
