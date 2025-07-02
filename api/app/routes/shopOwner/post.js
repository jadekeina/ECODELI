// routes/shopOwner/post.js
const express = require("express");
const router = express.Router();
const createShopOwner = require("../../controllers/shopOwner/createShopOwner");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponse(res, 401, {}, { message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const result = await createShopOwner(token, req.body);
        return jsonResponse(res, 201, {}, result);
    } catch (error) {
        console.error("createShopOwner error:", error);
        return jsonResponse(res, 500, {}, { message: error.message });
    }
});

module.exports = router;
