const express = require("express");
const router = express.Router();
const createWarehouse = require("../../controllers/warehouses/createWarehouse");
const verifyToken = require("../../librairies/authMiddleware");
const isAdmin = require("../../librairies/isAdmin");
const { jsonResponse } = require("../../librairies/response");

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const id = await createWarehouse(req.body);
        return jsonResponse(res, 201, {}, { message: "Entrepôt créé ✅", id });
    } catch (error) {
        console.error("Erreur dans POST /warehouses :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

module.exports = router;
