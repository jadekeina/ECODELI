// Fichier : app/routes/status/patch.js

const express = require("express");
const router = express.Router();
const updateStatus = require("../../controllers/status/updateStatus");
const { isPatchMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.patch("/:table/:id", async (req, res) => {
    if (!isPatchMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    const { table, id } = req.params;
    const { status } = req.body;

    if (!status) {
        return jsonResponse(res, 400, {}, { message: "Le champ 'status' est requis" });
    }

    try {
        await updateStatus(table, id, status);
        return jsonResponse(res, 200, {}, { message: `Statut de ${table} #${id} mis à jour` });
    } catch (error) {
        console.error("Erreur mise à jour statut :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
