const Service = require("../../models/service");

const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Vérifier si l'ID du service est fourni
        if (!serviceId) {
            console.log("[getServiceById] ID de service manquant dans la requête.");
            return res.status(400).json({ message: "ID de service manquant." });
        }

        console.log(`[getServiceById] Requête reçue pour serviceId: ${serviceId}`);

        const service = await Service.getById(serviceId);

        if (!service) {
            console.log(`[getServiceById] Service non trouvé pour ID: ${serviceId}`);
            return res.status(404).json({ message: "Service non trouvé." });
        }

        console.log(`[getServiceById] Service récupéré pour ID ${serviceId}:`, service);
        return res.status(200).json({ message: "Service récupéré", service });
    } catch (error) {
        console.error("❌ Erreur récupération service par ID :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

module.exports = getServiceById;
