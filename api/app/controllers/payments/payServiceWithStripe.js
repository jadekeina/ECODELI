// controllers/payments/payServiceWithStripe.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../../../config/db");
const ServicePayment = require("../../models/servicePayment");

/**
 * @param {Object} data - { request_id }
 * @returns {Promise<Object>} Stripe client secret + infos
 */
const payServiceWithStripe = async ({ request_id }) => {
    const [[request]] = await db.promise().query(
        `SELECT sr.*, c.id AS client_id, p.id AS provider_id
     FROM service_requests sr
     JOIN users c ON sr.client_id = c.id
     LEFT JOIN users p ON sr.provider_id = p.id
     WHERE sr.id = ?`,
        [request_id]
    );

    if (!request) throw new Error("Demande introuvable");
    if (!request.provider_id) throw new Error("Aucun prestataire n'est encore assigné à cette demande");

    const montant = Math.max(Math.round((request.tarif || 50) * 100), 100); // tarif * 100 pour les centimes

    const paymentIntent = await stripe.paymentIntents.create({
        amount: montant,
        currency: "eur",
        description: `Paiement prestation EcoDeli #${request.id}`,
        metadata: {
            request_type: "service",
            request_id: request.id,
            user_id: request.client_id,
        },
        automatic_payment_methods: { enabled: true },
    });

    await ServicePayment.create({
        request_id: request.id,
        client_id: request.client_id,
        provider_id: request.provider_id,
        amount: montant / 100,
        status: "pending",
        method: "stripe",
        stripe_payment_id: paymentIntent.id,
    });

    return {
        clientSecret: paymentIntent.client_secret,
        amount: montant / 100,
        request_id: request.id,
    };
};

module.exports = payServiceWithStripe;
