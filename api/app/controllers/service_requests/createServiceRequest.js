const db = require("../../../config/db");

const createServiceRequest = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== "client") {
            return res.status(403).json({ message: "Accès non autorisé." });
        }

        const { prestation_id, date, heure, lieu, commentaire } = req.body;
        console.log("🎯 Données reçues :", { prestation_id, date, heure, lieu, commentaire });

        if (!prestation_id || !date || !heure || !lieu) {
            return res.status(400).json({ message: "Tous les champs obligatoires ne sont pas remplis." });
        }

        const query = `
      INSERT INTO service_requests (prestation_id, client_id, date, heure, lieu, commentaire)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

        db.query(
            query,
            [prestation_id, user.id, date, heure, lieu, commentaire],
            (err, result) => {
                if (err) {
                    console.error("❌ Erreur SQL:", err);
                    return res.status(500).json({ message: "Erreur serveur." });
                }
                return res.status(201).json({ message: "Demande envoyée.", id: result.insertId });
            }
        );
    } catch (error) {
        console.error("❌ Erreur createServiceRequest:", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

module.exports = createServiceRequest;
