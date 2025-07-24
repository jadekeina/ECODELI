// routes/shopownerRequests/status.js
const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const { isPatchMethod } = require("../../librairies/method");
const updateStatusController = require("../../controllers/shopowner_requests/updateShopOwnerRequestStatus");

router.patch("/:id/status", auth, async (req, res) => {
    if (!isPatchMethod(req)) {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    try {
        await updateStatusController(req, res);
    } catch (error) {
        console.error("Erreur inattendue PATCH /shopowner-requests/:id/status :", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Erreur serveur inattendue.", error: error.message });
        }
    }
});

module.exports = router;
