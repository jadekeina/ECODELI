// routes/documents/get.js
const express = require("express");
const router = express.Router();
const model = require("../../models/documents");
const { jsonResponse } = require("../../librairies/response");

router.get("/:userId", (req, res) => {
    const userId = req.params.userId;

    model.getDocumentsByUser(userId, (err, result) => {
        if (err) {
            return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
        }
        return jsonResponse(res, 200, result);
    });
});

module.exports = router;
