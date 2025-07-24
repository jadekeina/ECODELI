const express = require("express");
const router = express.Router();

const auth = require("../../librairies/authMiddleware");
const { isGetMethod, isPostMethod, isPatchMethod, isDeleteMethod } = require("../../librairies/method");
const response = require("../../librairies/response");

// Controllers
const createService = require("../../controllers/services/createService");
const deleteService = require("../../controllers/services/deleteService");
const getServiceById = require("../../controllers/services/getServiceById");
const getServicesByProvider = require("../../controllers/services/getServicesByProvider");
const updateService = require("../../controllers/services/updateService");

// POST /services - créer un service
router.post("/", auth, async (req, res) => {
    if (!isPostMethod(req)) return response.methodNotAllowed(res);
    try {
        await createService(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

// --- DÉBUT DE LA MODIFICATION CRUCIALE ---
// L'ordre est important ! La route générale doit venir avant la route avec un paramètre.

// GET /services - récupérer les services du provider connecté
router.get("/", auth, async (req, res) => {
    if (!isGetMethod(req)) return response.methodNotAllowed(res);
    try {
        await getServicesByProvider(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

// GET /services/:id - récupérer un service par ID
router.get("/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) return response.methodNotAllowed(res);
    try {
        await getServiceById(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});
// --- FIN DE LA MODIFICATION CRUCIALE ---


// PATCH /services/:id - modifier un service
router.patch("/:id", auth, async (req, res) => {
    if (!isPatchMethod(req)) return response.methodNotAllowed(res);
    try {
        await updateService(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

// DELETE /services/:id - supprimer un service
router.delete("/:id", auth, async (req, res) => {
    if (!isDeleteMethod(req)) return response.methodNotAllowed(res);
    try {
        await deleteService(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

module.exports = router;
