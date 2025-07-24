const db = require("../../../config/db");

const getServiceRequestsByProvider = async (req, res) => {
    const providerId = req.params.id;

    if (!providerId) {
        // Log d'erreur plus détaillé
        console.error("❌ [getServiceRequestsByProvider] ID du prestataire manquant dans les paramètres.");
        return res.status(400).json({ message: "ID du prestataire manquant." });
    }

    const query = `
        SELECT sr.*, u.firstname, u.lastname, s.type
        FROM service_requests sr
                 JOIN services s ON sr.prestation_id = s.id
                 JOIN users u ON sr.client_id = u.id
        WHERE s.provider_id = ?
        ORDER BY sr.date DESC, sr.heure DESC
    `;

    try {
        // Enveloppe db.query dans une Promise pour permettre l'utilisation de await
        const rows = await new Promise((resolve, reject) => {
            db.query(query, [providerId], (err, results) => {
                if (err) {
                    console.error("❌ [getServiceRequestsByProvider] Erreur SQL:", err);
                    return reject(err);
                }
                // mysql2 retourne un tableau de [rows, fields], nous voulons juste les rows
                resolve(results);
            });
        });
        console.log(`✅ [getServiceRequestsByProvider] ${rows.length} demandes trouvées pour provider ID: ${providerId}`);
        return res.status(200).json({ requests: rows });
    } catch (err) {
        console.error("❌ [getServiceRequestsByProvider] Erreur serveur lors de la récupération des demandes:", err);
        return res.status(500).json({ message: "Erreur serveur.", error: err.message });
    }
};

module.exports = getServiceRequestsByProvider;
