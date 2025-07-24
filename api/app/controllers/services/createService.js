const Service = require("../../models/service");
const db = require("../../../config/db"); // Importer l'objet db pour la fonction utilitaire

// Fonction utilitaire pour obtenir le provider_id à partir du user_id
// C'est la même fonction que nous avons utilisée pour les paiements.
const getProviderIdFromUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        // Supposons que votre table 'provider' a une colonne 'user_id' qui référence 'users.id'
        db.query(`SELECT id FROM provider WHERE user_id = ?`, [userId], (err, rows) => {
            if (err) {
                console.error("❌ [getProviderIdFromUserId] Erreur SQL lors du mapping user_id à provider_id:", err);
                return reject(err);
            }
            if (rows.length > 0) {
                resolve(rows[0].id);
            } else {
                resolve(null); // Retourne null si aucun provider n'est trouvé pour cet user_id
            }
        });
    });
};


const createService = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, description, price, status } = req.body; // ✅ ici tu ajoutes `status`

        if (!type || !price) {
            return res.status(400).json({ message: "Type et prix sont requis." });
        }

        const providerId = await getProviderIdFromUserId(userId);

        if (!providerId) {
            console.error(`Erreur création service: Aucun provider trouvé pour user_id: ${userId}`);
            return res.status(404).json({ message: "Prestataire non trouvé pour l'utilisateur connecté." });
        }

        const allowedStatuses = ["actif", "inactif"];
        const safeStatus = allowedStatuses.includes(status) ? status : "en_attente";

        const serviceData = {
            provider_id: providerId,
            type,
            description,
            price,
            status: safeStatus,
        };

        const newService = await Service.create(serviceData);

        return res.status(201).json({ message: "Service créé.", service: newService });
    } catch (error) {
        console.error("Erreur création service:", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};


module.exports = createService;
