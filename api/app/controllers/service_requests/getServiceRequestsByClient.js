// api/app/controllers/service_requests/getServiceRequestsByClient.js
const ServiceRequest = require("../../models/service_requests");
const { jsonResponse } = require("../../librairies/response");

const getServiceRequestsByClient = async (req, res) => {
    try {
        const clientId = req.params.id; // L'ID du client est extrait des paramètres de l'URL
        const user = req.user; // L'utilisateur authentifié

        // Vérification de l'authentification et du rôle
        if (!user || user.role !== "client" || user.id !== parseInt(clientId, 10)) {
            console.warn("⚠️ [getServiceRequestsByClient] Accès non autorisé ou ID client mismatch. User:", user, "Requested Client ID:", clientId);
            return jsonResponse(res, 403, {}, { message: "Accès non autorisé. Vous ne pouvez voir que vos propres demandes." });
        }

        // Validation pour s'assurer que l'ID est un nombre valide
        if (!clientId || isNaN(clientId)) {
            console.error("❌ [getServiceRequestsByClient] ID client invalide dans les paramètres:", clientId);
            return jsonResponse(res, 400, {}, { message: "ID client invalide." });
        }

        const requests = await ServiceRequest.findByClientId(parseInt(clientId, 10));

        console.log(`✅ [getServiceRequestsByClient] ${requests.length} demandes trouvées pour client ID: ${clientId}`);
        jsonResponse(res, 200, {}, { message: "Demandes récupérées avec succès.", requests: requests });

    } catch (error) {
        console.error("❌ [getServiceRequestsByClient] Erreur serveur lors de la récupération des demandes client:", error);
        jsonResponse(res, 500, {}, { message: "Erreur interne du serveur.", error: error.message });
    }
};

module.exports = getServiceRequestsByClient;
