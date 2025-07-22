const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const createShop = require("../../controllers/shops/createShop");
const { jsonResponse } = require("../../librairies/response");

router.post("/create", auth, async (req, res) => {
    try {
        const result = await createShop(req.headers.authorization?.split(" ")[1], req.body);
        jsonResponse(res, 201, {}, result);
    } catch (err) {
        console.error("❌ [POST /shops/create] Erreur :", err.message);
        jsonResponse(res, 500, {}, { message: "Erreur serveur", error: err.message });
    }
});

module.exports = router;
