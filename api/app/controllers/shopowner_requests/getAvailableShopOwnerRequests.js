// controllers/shopowner_requests/getAvailableShopOwnerRequests.js
const ShopOwnerRequest = require('../../models/shopownerRequest');
const db = require("../../../config/db"); // Pour récupérer l'ID du livreur

module.exports = async (req, res) => {
    console.log("🚀 Controller 'getAvailableShopOwnerRequests.js' is being executed.");

    try {
        if (!req.user || !req.user.id) {
            console.log("🚫 Non authentifié ou user.id manquant.");
            return res.status(401).json({ message: "Non authentifié." });
        }

        console.log("👤 User ID from token (type et valeur):", typeof req.user.id, req.user.id);

        let deliveryDriverId = null;

        // Récupérer l'ID réel du livreur à partir de l'ID utilisateur
        // CORRECTION ICI : Enlève la déstructuration [] pour que driverRows soit l'array complet
        const driverRows = await new Promise((resolve, reject) => {
            const userIdAsInt = parseInt(req.user.id, 10);
            console.log("🔍 Exécution de la requête SQL pour delivery_driver avec user_id:", userIdAsInt);

            db.query('SELECT id FROM delivery_driver WHERE user_id = ?', [userIdAsInt], (err, results) => {
                if (err) {
                    console.error("❌ Erreur SQL lors de la récupération de driver ID:", err);
                    return reject(err);
                }
                console.log("✅ Résultat brut de la requête delivery_driver (avant resolve):", results);
                resolve(results); // 'results' est déjà le tableau de lignes [ { id: 5 } ]
            });
        });

        console.log("✅ driverRows après await (type et valeur):", typeof driverRows, driverRows); // Nouveau log pour confirmation

        if (driverRows && driverRows.length > 0) {
            deliveryDriverId = driverRows[0].id;
            console.log("✅ Delivery Driver ID found:", deliveryDriverId);
        } else {
            console.log("⚠️ Profil de livreur non trouvé pour cet utilisateur (après requête DB):", req.user.id);
            if (req.user.role === 'delivery-driver') {
                return res.status(404).json({ message: "Profil de livreur non trouvé pour cet utilisateur." });
            } else {
                return res.status(403).json({ message: "Accès non autorisé pour ce rôle." });
            }
        }

        console.log("🔍 Appel de findAllForDeliveryDrivers avec ID:", deliveryDriverId);
        const offers = await ShopOwnerRequest.findAllForDeliveryDrivers(deliveryDriverId);
        console.log("✅ Offres récupérées du modèle. Nombre d'offres:", offers.length);
        res.status(200).json(offers);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des offres disponibles :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des offres disponibles." });
    }
};
