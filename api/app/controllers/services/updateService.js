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

const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const userId = req.user.id; // L'ID de l'utilisateur connecté
        const { type, description, price, status } = req.body;

        // Mapper userId à un provider_id valide
        const providerId = await getProviderIdFromUserId(userId);

        if (!providerId) {
            console.error(`Erreur mise à jour service: Aucun provider trouvé pour user_id: ${userId}`);
            return res.status(404).json({ message: "Prestataire non trouvé pour l'utilisateur connecté." });
        }

        // Vérifier que le service appartient bien au provider (sécurité)
        const service = await Service.getById(serviceId);
        if (!service || service.provider_id !== providerId) { // Utiliser le providerId mappé ici aussi
            return res.status(403).json({ message: "Accès refusé ou service introuvable" });
        }

        const result = await Service.update(serviceId, { type, description, price, status });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Service non mis à jour" });
        }

        return res.status(200).json({ message: "Service mis à jour" });
    } catch (error) {
        console.error("Erreur mise à jour service :", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = updateService;
