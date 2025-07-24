const db = require("../../../config/db");

const processPendingServicePayments = async () => {
    try {
        const selectQuery = `
            SELECT sp.id
            FROM service_payments sp
                     JOIN service_requests sr ON sr.id = sp.request_id
            WHERE sp.status = 'pending'
              AND sr.statut = 'terminee'
              -- AND sp.created_at <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        `;

        const [payments] = await db.promise().query(selectQuery);

        if (payments.length === 0) {
            console.log("[CRON] Aucun paiement service à mettre à jour.");
            return false;
        }

        const ids = payments.map(p => p.id);
        console.log(`[CRON] Paiements service à traiter : ${ids.join(", ")}`);

        const updateQuery = `
            UPDATE service_payments
            SET status = 'effectue', payment_date = NOW()
            WHERE id IN (?)
        `;

        const [result] = await db.promise().query(updateQuery, [ids]);
        console.log(`[CRON] Paiements service mis à jour : ${result.affectedRows}`);
        return true;
    } catch (error) {
        console.error("❌ [CRON] Erreur traitement paiements service :", error);
        return false;
    }
};

module.exports = { processPendingServicePayments };
