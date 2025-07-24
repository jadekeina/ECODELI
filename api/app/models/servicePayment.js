// models/servicePayment.js
const db = require("../../config/db");

const ServicePayment = {
    async create(data) {
        const {
            request_id,
            provider_id,
            client_id,
            amount,
            status = "pending",
            method = "stripe",
            stripe_payment_id = null,
        } = data;

        const [result] = await db.promise().query(
            `INSERT INTO service_payments (request_id, provider_id, client_id, amount, status, method, stripe_payment_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [request_id, provider_id, client_id, amount, status, method, stripe_payment_id]
        );

        return { id: result.insertId, ...data };
    },

    async getByProviderId(provider_id) {
        const [rows] = await db.promise().query(
            `SELECT * FROM service_payments WHERE provider_id = ? ORDER BY created_at DESC`,
            [provider_id]
        );
        return rows;
    },

    async getBalance(provider_id) {
        const [[row]] = await db.promise().query(
            `SELECT COALESCE(SUM(amount), 0) AS total FROM service_payments WHERE provider_id = ? AND status = 'effectue'`,
            [provider_id]
        );
        return row.total;
    },

    async updateStatus(id, status, payment_date = null) {
        const [result] = await db.promise().query(
            `UPDATE service_payments SET status = ?, payment_date = ? WHERE id = ?`,
            [status, payment_date || new Date(), id]
        );
        return result.affectedRows > 0;
    },

    async findByStripePaymentId(stripe_payment_id) {
        const [[row]] = await db.promise().query(
            `SELECT * FROM service_payments WHERE stripe_payment_id = ?`,
            [stripe_payment_id]
        );
        return row;
    }
};

module.exports = ServicePayment;
