// controllers/delivery_drivers/getDriverByUserId.js
const db = require("../../../config/db"); // Votre objet db existant qui utilise des callbacks

module.exports = async (req, res) => {
    const { userId } = req.params; // L'ID utilisateur passé dans l'URL

    try {
        // Assurez-vous que l'utilisateur qui fait la requête est bien celui dont on cherche le profil
        // ou qu'il a les permissions nécessaires (par exemple, admin)
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé." });
        }

        // Envelopper db.query dans une Promise pour pouvoir utiliser await
        const rows = await new Promise((resolve, reject) => {
            db.query('SELECT id, user_id, statut_validation FROM delivery_driver WHERE user_id = ?', [userId], (err, results) => {
                if (err) {
                    console.error("❌ Erreur SQL lors de la récupération du profil livreur :", err);
                    return reject(err);
                }
                // mysql2 retourne un tableau de [rows, fields]
                resolve(results[0] ? [results[0]] : []); // Retourne un tableau avec la première ligne ou un tableau vide
            });
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "Profil de livreur non trouvé pour cet utilisateur." });
        }

        // Retourne l'ID du livreur et son statut de validation
        return res.status(200).json({
            id: rows[0].id, // C'est cet ID que le frontend doit utiliser
            user_id: rows[0].user_id,
            statut_validation: rows[0].statut_validation
        });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil livreur par user_id :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du profil livreur." });
    }
};
