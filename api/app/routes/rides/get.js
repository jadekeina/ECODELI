const express = require("express");
const router = express.Router();
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const { findRideById, getAllRides } = require("../../controllers/rides/findRideById");
const getProviderRides = require("../../controllers/rides/getProviderRides");

// GET /rides/get/:id
router.get("/get/:id", async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const ride = await findRideById(req.params.id);
        if (!ride) {
            return jsonResponse(res, 404, {}, { message: "Course introuvable" });
        }

        return jsonResponse(res, 200, {}, { message: "Course trouvée", ride });
    } catch (error) {
        console.error("Erreur lors de la récupération de la course:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

// GET /rides/get
router.get("/get", async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rides = await getAllRides();
        return jsonResponse(res, 200, {}, { message: "Liste des courses", rides });
    } catch (error) {
        console.error("Erreur récupération courses:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

// GET /rides/user/:id
router.get("/user/:id", async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rides = await getUserRides(req.params.id);
        return jsonResponse(res, 200, {}, { message: "Courses utilisateur récupérées", rides });
    } catch (error) {
        console.error("Erreur récupération courses utilisateur:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

router.get("/provider/:id", async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rides = await getProviderRides(req.params.id);
        return jsonResponse(res, 200, {}, { message: "Courses du prestataire", rides });
    } catch (error) {
        console.error("Erreur récupération courses prestataire:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});


module.exports = router;
