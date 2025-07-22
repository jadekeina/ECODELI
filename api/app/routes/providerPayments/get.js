const express = require("express");
const router = express.Router();
const auth = require("../../librairies/auth");
const getProviderPayments = require("../../controllers/providerPayments/getProviderPayments");
const ProviderPayment = require("../../models/providerPayment");
const db = require("../../../config/db"); // <-- AJOUT CRUCIAL ICI : Importer l'objet db

// Fonction utilitaire pour obtenir le provider_id à partir du user_id
const getProviderIdFromUserId = async (userId) => {
    // Supposons que votre table 'provider' a une colonne 'user_id' qui référence 'users.id'
    // Utilisation de db.query() enveloppé dans une Promise
    return new Promise((resolve, reject) => {
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


// Obtenir le solde d'un provider
router.get('/balance/:userId', auth, async (req, res) => {
    const userId = req.params.userId;
    if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: "Accès refusé. Vous ne pouvez consulter que votre propre solde." });
    }

    console.log(`[Backend - /balance/:userId] Requête reçue pour userId: ${userId}`);
    try {
        const providerId = await getProviderIdFromUserId(userId);
        if (!providerId) {
            console.warn(`[Backend - /balance/:userId] Aucun provider_id trouvé pour userId: ${userId}`);
            return res.status(404).json({ message: "Prestataire non trouvé." });
        }

        const balance = await ProviderPayment.getBalance(providerId);
        console.log(`[Backend - /balance/:userId] Solde récupéré pour providerId ${providerId}: ${balance}`);
        res.json({ balance });
    } catch (error) {
        console.error("❌ [Backend - /balance/:userId] Erreur get balance :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

// Obtenir tous les paiements d'un provider
router.get("/:userId", auth, async (req, res) => {
    const userId = req.params.userId;
    if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: "Accès refusé. Vous ne pouvez consulter que vos propres paiements." });
    }

    console.log(`[Backend - /:userId] Requête reçue pour userId: ${userId}`);
    try {
        const providerId = await getProviderIdFromUserId(userId);
        if (!providerId) {
            console.warn(`[Backend - /:userId] Aucun provider_id trouvé pour userId: ${userId}`);
            return res.status(404).json({ message: "Prestataire non trouvé." });
        }

        const payments = await getProviderPayments(providerId);
        console.log(`[Backend - /:userId] Paiements récupérés pour providerId ${providerId}:`, payments);
        return res.status(200).json({ payments, message: "Paiements du prestataire" });
    } catch (error) {
        console.error("❌ [Backend - /:userId] Erreur récupération paiements prestataire :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});


module.exports = router;
