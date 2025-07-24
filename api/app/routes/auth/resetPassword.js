const express = require("express");
const router = express.Router();
const resetPassword = require("../../controllers/auth/resetPassword");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    const { token, password } = req.body;

    try {
        const result = await resetPassword(token, password);
        return jsonResponse(res, 200, {}, { message: result });
    } catch (error) {
        return jsonResponse(res, 400, {}, { message: error.message });
    }
});

module.exports = router;
