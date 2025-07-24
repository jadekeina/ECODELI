// controllers/service_requests/getServiceRequestById.js
// Ce contrôleur gère la logique métier pour récupérer une demande de service par son ID.

// Importez uniquement jsonResponse de votre bibliothèque de réponses
const { jsonResponse } = require("../../librairies/response"); // Assurez-vous que ce chemin est correct
const ServiceRequest = require("../../models/service_requests"); // Chemin vers votre modèle ServiceRequest

const getServiceRequestById = async (req, res) => {
    try {
        const { id } = req.params; // L'ID de la demande est extrait des paramètres de l'URL

        // Validation pour s'assurer que l'ID est un nombre valide
        if (!id || isNaN(id)) {
            // Utilisation de jsonResponse pour une mauvaise requête (400)
            return jsonResponse(res, 400, {}, { message: "ID de demande invalide." });
        }

        const requestId = parseInt(id, 10); // Convertit l'ID en nombre entier

        // Appelle la méthode findById du modèle ServiceRequest pour récupérer la demande
        const request = await ServiceRequest.findById(requestId);

        if (!request) {
            // Utilisation de jsonResponse pour une ressource non trouvée (404)
            return jsonResponse(res, 404, {}, { message: "Demande de prestation non trouvée." });
        }

        // Si la demande est trouvée, renvoie les détails avec un statut 200 OK
        // Utilisation de jsonResponse pour le succès (200)
        jsonResponse(res, 200, {}, { message: "Détails de la demande récupérés avec succès.", request: request });

    } catch (error) {
        // En cas d'erreur inattendue, enregistre l'erreur et renvoie une erreur serveur (500)
        console.error("❌ Erreur dans getServiceRequestById:", error);
        // Utilisation de jsonResponse pour une erreur interne du serveur (500)
        jsonResponse(res, 500, {}, { message: "Erreur interne du serveur lors de la récupération de la demande.", error: error.message });
    }
};

module.exports = getServiceRequestById;
