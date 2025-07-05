const express = require("express");
const router = express.Router();
const getWarehouses = require("../../controllers/warehouses/getWarehouses");
const isAdmin = require("../../librairies/isAdmin");
const verifyToken = require("../../librairies/authMiddleware");
const { jsonResponse } = require("../../librairies/response");

// ✅ Middleware global : admin uniquement
router.use(verifyToken, isAdmin);

// 📦 GET /warehouses
router.get("/", async (req, res) => {
    try {
        const data = await getWarehouses();
        return jsonResponse(res, 200, {}, { message: "Entrepôts récupérés ✅", data });
    } catch (error) {
        console.error("Erreur dans GET /warehouses :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

// Tu pourras plus tard ajouter ici :
// router.post("/", createWarehouse)
// router.put("/:id", updateWarehouse)
// router.delete("/:id", deleteWarehouse)

module.exports = router;
