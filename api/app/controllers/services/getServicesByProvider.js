const Service = require("../../models/service");
const db = require("../../../config/db"); // Importer l'objet db pour la fonction utilitaire

// Fonction utilitaire pour obtenir le provider_id à partir du user_id
const getProviderIdFromUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM provider WHERE user_id = ?`, [userId], (err, rows) => {
            if (err) {
                console.error("❌ [getProviderIdFromUserId] Erreur SQL lors du mapping user_id à provider_id:", err);
                return reject(err);
            }
            if (rows.length > 0) {
                resolve(rows[0].id);
            } else {
                resolve(null);
            }
        });
    });
};

const getServicesByProvider = async (req, res) => {
    try {
        const userId = req.user.id; // L'ID de l'utilisateur connecté

        // Mapper userId à un provider_id valide
        const providerId = await getProviderIdFromUserId(userId);

        if (!providerId) {
            console.error(`Erreur récupération services: Aucun provider trouvé pour user_id: ${userId}`);
            // Si aucun provider n'est trouvé, renvoyer un tableau vide de services
            return res.status(200).json({ message: "Aucun service trouvé pour ce prestataire.", services: [] });
        }

        const services = await Service.getByProviderId(providerId); // Utiliser le providerId mappé
        return res.status(200).json({ message: "Services récupérés", services });
    } catch (error) {
        console.error("Erreur récupération services :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

module.exports = getServicesByProvider;
