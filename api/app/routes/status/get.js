// Fichier : app/routes/status/getId.js

const express = require("express");
const router = express.Router();
const getGeneric = require("../../controllers/shared/getGeneric");
const { jsonResponse } = require("../../librairies/response");

router.get("/:table", async (req, res) => {
    const { table } = req.params;

    try {
        const result = await getGeneric(table);
        return jsonResponse(res, 200, {}, result);
    } catch (error) {
        console.error("Erreur récupération objets :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
