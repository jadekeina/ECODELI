// routes/shopOwner/patch.js
const express = require("express");
const router = express.Router();
const updateShopOwner = require("../../controllers/shopOwner/updateShopOwner");
const { isPatchMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.patch("/", async (req, res) => {
    if (!isPatchMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponse(res, 401, {}, { message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const result = await updateShopOwner(token, req.body);
        return jsonResponse(res, 200, {}, result);
    } catch (error) {
        console.error("updateShopOwner error:", error);
        return jsonResponse(res, 500, {}, { message: error.message });
    }
});

module.exports = router;
