// routes/shopownerRequests/en-attente.js
const express = require("express");
const router = express.Router();
const getShopOwnerRequestsEnAttente = require("../../controllers/shopowner_requests/getShopOwnerRequestsEnAttente");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const auth = require("../../librairies/auth");
const authorizeRoles = require("../../librairies/authorizeRoles");

router.get("/", auth, authorizeRoles("delivery-driver", "admin"), async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const results = await getShopOwnerRequestsEnAttente();
        return jsonResponse(res, 200, {}, {
            requests: results,
            message: "Demandes commerçants en attente récupérées avec succès."
        });
    } catch (error) {
        console.error("❌ Erreur getShopOwnerRequestsEnAttente :", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
