const express = require("express");
const router = express.Router();
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

const findRideById = require("../../controllers/rides/findRideById");
const getAllRides = require("../../controllers/rides/getAllRides");
const getProviderRides = require("../../controllers/rides/getProviderRides");
const getUserRides = require("../../controllers/rides/getUserRides");

const auth = require("../../librairies/auth");
const authorizeRoles = require("../../librairies/authorizeRoles");

// GET /rides/get/:id (sécurisé)
router.get("/get/:id", auth, authorizeRoles("admin", "provider", "client"), async (req, res) => {
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

// GET /rides/get (sécurisé)
router.get("/get", auth, authorizeRoles("admin", "provider", "client"), async (req, res) => {
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rides = await getAllRides(req.user); // ⬅️ avec vérification du rôle dans le contrôleur
        return jsonResponse(res, 200, {}, { message: "Liste des courses", rides });
    } catch (error) {
        console.error("Erreur récupération courses:", error);
        const status = error.statusCode || 500;
        return jsonResponse(res, status, {}, { message: error.message });
    }
});

// GET /rides/get/:id (sécurisé)
router.get("/get/:id", auth, authorizeRoles("admin", "provider", "client"), async (req, res) => { // 'client' ajouté ici
    if (!isGetMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
    }

    try {
        const rideId = req.params.id;
        const userId = req.user.id; // L'ID de l'utilisateur connecté, disponible grâce au middleware 'auth'
        const userRole = req.user.role; // Le rôle de l'utilisateur, disponible aussi

        const ride = await findRideById(rideId); // Assurez-vous que findRideById retourne un objet 'ride' avec client_id

        if (!ride) {
            return jsonResponse(res, 404, {}, { message: "Course introuvable" });
        }

        // --- AJOUT DE LA VÉRIFICATION DE PROPRIÉTÉ POUR LES CLIENTS ---
        // Les admins et providers peuvent voir toutes les courses.
        // Les clients ne peuvent voir que leurs propres courses.
        if (userRole === "client" && ride.client_id !== userId) {
            // Si c'est un client et que la course ne lui appartient pas
            return jsonResponse(res, 403, {}, { message: "Accès interdit : Cette course ne vous appartient pas." });
        }
        // -----------------------------------------------------------

        return jsonResponse(res, 200, { ride }, { message: "Course trouvée" }); // Notez que 'ride' est dans un objet
    } catch (error) {
        console.error("Erreur lors de la récupération de la course:", error);
        return jsonResponse(res, 500, {}, { message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
