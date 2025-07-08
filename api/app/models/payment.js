// Fichier : api/app/models/payment.js
const db = require("../../config/db");

/**
 * Crée un paiement lié à une ride.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const createPayment = async (data) => {
    const [result] = await db
        .promise()
        .query(
            `INSERT INTO payments (ride_id, stripe_payment_id, amount, status)
       VALUES (?, ?, ?, ?)`,
            [data.ride_id, data.stripe_payment_id, data.amount, data.status]
        );

    return { id: result.insertId, ...data };
};

/**
 * Met à jour le statut d’un paiement.
 * @param {number} id
 * @param {string} status
 * @returns {Promise<void>}
 */
const updatePaymentStatus = async (id, status) => {
    await db
        .promise()
        .query(`UPDATE payments SET status = ? WHERE id = ?`, [status, id]);
};

/**
 * Récupère un paiement par son ID Stripe.
 * @param {string} stripeId
 * @returns {Promise<Object|null>}
 */
const findPaymentByStripeId = async (stripeId) => {
    const [rows] = await db
        .promise()
        .query(`SELECT * FROM payments WHERE stripe_payment_id = ?`, [stripeId]);

    return rows.length ? rows[0] : null;
};

module.exports = {
    createPayment,
    updatePaymentStatus,
    findPaymentByStripeId,
};
