const express = require("express");
const router = express.Router();
const resetPassword = require("../../controllers/auth/resetPassword");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/reset-password/:token", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    try {
        const result = await resetPassword(req.params.token, req.body.password);
        return jsonResponse(res, 200, {}, { message: result });
    } catch (error) {
        return jsonResponse(res, 400, {}, { message: error.message });
    }
});

module.exports = router;
