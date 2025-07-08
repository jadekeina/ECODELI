const express = require("express");
const router = express.Router();
const sendResetPassword = require("../../controllers/auth/sendResetPassword");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/send-reset-password", async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    try {
        const result = await sendResetPassword(req.body.email);
        return jsonResponse(res, 200, {}, { message: result });
    } catch (error) {
        return jsonResponse(res, 400, {}, { message: error.message });
    }
});

module.exports = router;
