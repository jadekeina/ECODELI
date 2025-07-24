// api/app/routes/service_requests/getByClient.js
const express = require("express");
const router = express.Router();

const getServiceRequestsByClient = require("../../controllers/service_requests/getServiceRequestsByClient");
const auth = require("../../librairies/authMiddleware"); // Assurez-vous que le chemin est correct
const { isGetMethod } = require("../../librairies/method");
const response = require("../../librairies/response"); // Pour les réponses génériques

// Définit la route GET pour récupérer les demandes par l'ID du client
// Le chemin est "/client/:id", car ce routeur sera monté sous "/service_requests" dans app.js
router.get("/client/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) return response.methodNotAllowed(res);
    try {
        await getServiceRequestsByClient(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

module.exports = router;
