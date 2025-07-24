// routes/requests/admin.js
const express = require("express");
const router = express.Router();
const requestModel = require("../../models/requests");
const { jsonResponse } = require("../../librairies/response");

// Route admin pour récupérer toutes les annonces avec infos utilisateur
router.get("/", (req, res) => {
    requestModel.getAllRequestsWithUser((err, result) => {
        console.log("Résultat SQL admin requests:", result);
        if (err) {
            console.error("Erreur récupération annonces admin:", err);
            return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
        }
        return jsonResponse(res, 200, result);
    });
});

// Route admin pour supprimer une annonce
router.delete("/:id", (req, res) => {
    const requestId = req.params.id;

    requestModel.deleteRequest(requestId, (err, result) => {
        if (err) {
            console.error("Erreur suppression annonce:", err);
            return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
        }

        if (result.affectedRows === 0) {
            return jsonResponse(res, 404, {}, { message: "Annonce non trouvée" });
        }

        return jsonResponse(res, 200, {}, { message: "Annonce supprimée avec succès" });
    });
});

module.exports = router;