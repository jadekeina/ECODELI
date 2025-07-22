const db = require("../../../config/db");

const processPendingProviderPayments = async () => {
    try {
        // Récupérer les paiements provider en attente liés à des courses terminées depuis au moins 5 minutes
        const selectQuery = `
            SELECT pp.id
            FROM provider_payments pp
                     JOIN rides r ON r.id = pp.ride_id
            WHERE pp.status = 'en_attente'
              AND r.status = 'terminee'
              AND pp.created_at <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        `;

        const [payments] = await db.promise().query(selectQuery);

        if (payments.length === 0) {
            console.log("[Task] Aucun paiement provider à mettre à jour.");
            return false;
        }

        const ids = payments.map(p => p.id);
        if (ids.length === 0) {
            console.log("[Task] Aucun ID de paiement trouvé.");
            return false;
        }

        console.log(`[Task] Paiements à mettre à jour : ${ids.join(", ")}`);

        const updateQuery = `
            UPDATE provider_payments
            SET status = 'effectue', payment_date = NOW()
            WHERE id IN (?)
        `;

        const [result] = await db.promise().query(updateQuery, [ids]);

        console.log(`[Task] Paiements provider mis à jour : ${result.affectedRows}`);
        return true;
    } catch (error) {
        console.error("[Task] Erreur lors du traitement des paiements provider:", error);
        return false;
    }
};

module.exports = { processPendingProviderPayments };
