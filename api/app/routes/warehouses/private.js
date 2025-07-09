const express = require("express");
const router = express.Router();
const createWarehouse = require("../../controllers/warehouses/createWarehouse");
const verifyToken = require("../../librairies/authMiddleware");
const { jsonResponse } = require("../../librairies/response");

router.post("/", verifyToken, async (req, res) => {
    try {
        const user = req.user;

        // ✅ Vérification du rôle admin
        if (!user || user.role !== "admin") {
            return jsonResponse(res, 403, {}, { message: "Accès interdit : administrateur requis." });
        }

        await createWarehouse(req, res);
    } catch (error) {
        console.error("Erreur dans POST /warehouses :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur lors de la création de l'entrepôt." });
    }
});

module.exports = router;
