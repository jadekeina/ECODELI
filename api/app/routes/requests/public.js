const express = require("express");
const router = express.Router();
const getPublicRequests = require("../../controllers/requests/getPublicRequests");
const { jsonResponse } = require("../../librairies/response");
const getRequestById = require("../../controllers/requests/getRequestById");


router.get("/", async (req, res) => {
    try {
        await getPublicRequests(req, res);
    } catch (error) {
        console.error("Erreur dans /requests/public :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        await getRequestById(req, res);
    } catch (error) {
        console.error("Erreur dans /requests/public/:id :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
    }
});

module.exports = router;
