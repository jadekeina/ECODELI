const express = require("express");
const router = express.Router();
const getWarehouses = require("../../controllers/warehouses/getWarehouses");
const { jsonResponse } = require("../../librairies/response");

router.get("/", async (req, res) => {
    try {
        const data = await getWarehouses();
        return jsonResponse(res, 200, {}, { message: "Entrepôts disponibles ✅", data });
    } catch (error) {
        console.error("Erreur dans GET /warehouses :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

module.exports = router;
