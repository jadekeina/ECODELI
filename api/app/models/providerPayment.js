const db = require("../../config/db");

const ProviderPayment = {
    create: async (data) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO provider_payments
                           (provider_id, ride_id, services_id, amount, status, method, payment_date)
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const params = [
                data.provider_id,
                data.ride_id || null,
                data.services_id || null,
                data.amount,
                data.status || 'en_attente',
                data.method || 'virement',
                data.payment_date || null
            ];

            db.query(query, params, (err, result) => {
                if (err) {
                    console.error("❌ [ProviderPayment.create] Erreur SQL :", err);
                    return reject(err);
                }
                resolve({ id: result.insertId, ...data });
            });
        });
    },

    getByProviderId: async (providerId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM provider_payments WHERE provider_id = ? ORDER BY created_at DESC`;
            console.log(`[ProviderPayment.getByProviderId] Exécution de la requête SQL pour providerId: ${providerId}`);
            db.query(query, [providerId], (err, rows) => {
                if (err) {
                    console.error("❌ [ProviderPayment.getByProviderId] Erreur SQL :", err);
                    return reject(err);
                }
                console.log(`[ProviderPayment.getByProviderId] Paiements récupérés pour ${providerId}:`, rows);
                resolve(rows);
            });
        });
    },

    getBalance: async (providerId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT COALESCE(SUM(amount), 0) AS balance FROM provider_payments WHERE provider_id = ? AND status = 'effectue'`;
            console.log(`[ProviderPayment.getBalance] Exécution de la requête SQL pour solde de providerId: ${providerId}`);
            db.query(query, [providerId], (err, rows) => {
                if (err) {
                    console.error("❌ [ProviderPayment.getBalance] Erreur SQL :", err);
                    return reject(err);
                }
                console.log(`[ProviderPayment.getBalance] Résultat SQL solde pour ${providerId}:`, rows);
                if (rows && rows.length > 0) {
                    resolve(rows[0].balance);
                } else {
                    resolve(0);
                }
            });
        });
    }

};

module.exports = ProviderPayment;
