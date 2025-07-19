// routes/documents/get.js
const express = require("express");
const router = express.Router();
const model = require("../../models/documents");
const { jsonResponse } = require("../../librairies/response");
const jwt = require("jsonwebtoken");

// Route pour récupérer les documents de l'utilisateur connecté
router.get("/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponse(res, 401, {}, { message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId || decoded.id;

        model.getDocumentsByUser(userId, (err, result) => {
            if (err) {
                console.error("Erreur récupération documents:", err);
                return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
            }
            console.log("Documents pour userId", userId, ":", result);
            return jsonResponse(res, 200, result);
        });
    } catch (error) {
        return jsonResponse(res, 401, {}, { message: "Token invalide" });
    }
});



// Route pour l'admin : récupérer tous les documents en attente avec infos utilisateur
router.get("/pending", (req, res) => {
    model.getAllPendingDocumentsWithUser((err, result) => {
        console.log("Résultat SQL pending:", result); // <--- Ajoute ce log
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(result);
    });
});

// Route existante pour récupérer les documents d'un utilisateur spécifique (admin)
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
