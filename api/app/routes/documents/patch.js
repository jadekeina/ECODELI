// routes/documents/patch.js
const express = require("express");
const router = express.Router();
const validateDocument = require("../../controllers/documents/validateDocument");
const { jsonResponse } = require("../../librairies/response");
const { isPatchMethod } = require("../../librairies/method");

router.patch("/:id", async (req, res) => {
    if (!isPatchMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    const docId = req.params.id;
    const { statut } = req.body;

    try {
        const result = await validateDocument(docId, statut);
        return jsonResponse(res, 200, {}, result);
    } catch (error) {
        return jsonResponse(res, 500, {}, { message: error.message });
    }
});

module.exports = router;
