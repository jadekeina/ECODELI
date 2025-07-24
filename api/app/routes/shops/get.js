const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getShops = require("../../controllers/shops/getMyShops");
const { jsonResponse } = require("../../librairies/response");

router.get("/mine", auth, async (req, res) => {
    try {
        const result = await getShops(req.headers.authorization?.split(" ")[1]);
        jsonResponse(res, 200, {}, result);
    } catch (err) {
        console.error("❌ [GET /shops] Erreur :", err.message);
        jsonResponse(res, 500, {}, { message: "Erreur serveur", error: err.message });
    }
});

module.exports = router;
