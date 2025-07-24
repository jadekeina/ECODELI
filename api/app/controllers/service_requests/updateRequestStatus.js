const db = require("../../../config/db");
const sendAcceptedServiceRequestEmail = require("../emails/sendAcceptedServiceRequestEmail");
const sendRefusedServiceRequestEmail = require("../emails/sendRefusedServiceRequestEmail");

const updateRequestStatus = async (req, res) => {
    const requestId = req.params.id;
    const { statut } = req.body;

    const allowedStatuses = ["en_attente", "acceptee", "en_cours", "terminee", "refusee", "annulee"];
    if (!allowedStatuses.includes(statut)) {
        return res.status(400).json({ message: "Statut invalide." });
    }

    const sql = `UPDATE service_requests SET statut = ? WHERE id = ?`;

    db.query(sql, [statut, requestId], async (err, result) => {
        if (err) {
            console.error("Erreur SQL update statut:", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Demande non trouvée." });
        }

        try {
            if (statut === "acceptee") {
                await sendAcceptedServiceRequestEmail(requestId);
            } else if (statut === "refusee") {
                await sendRefusedServiceRequestEmail(requestId);
            } else if (statut === "terminee") {
                // Créer automatiquement un paiement s’il n’existe pas déjà
                const [[request]] = await db.promise().query(
                    `SELECT * FROM service_requests WHERE id = ?`,
                    [requestId]
                );

                const [existing] = await db.promise().query(
                    `SELECT id FROM service_payments WHERE request_id = ?`,
                    [requestId]
                );

                if (existing.length === 0 && request) {
                    const montant = request.tarif || 75;
                    await db.promise().query(
                        `INSERT INTO service_payments
                         (request_id, provider_id, client_id, amount, status, method, created_at)
                         VALUES (?, ?, ?, ?, 'pending', 'stripe', NOW())`,
                        [requestId, request.provider_id, request.client_id, montant]
                    );
                    console.log("✅ Paiement service auto-créé pour la demande terminée.");
                }
            }
        } catch (mailErr) {
            console.error("Erreur complémentaire après mise à jour statut:", mailErr);
        }

        return res.status(200).json({ message: `Statut mis à jour en '${statut}'.` });
    });
};

module.exports = updateRequestStatus;
