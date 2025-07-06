const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Met à jour dynamiquement le statut d'une entité (ex: ride, booking, delivery)
 * @param {string} tableName - ex: "rides"
 * @param {number} idconst {
    updatePaymentStatus,
    findPaymentByStripeId,
} = require("../../models/payment");

/**
 * Gère les événements webhook Stripe.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("⚠️  Erreur de signature webhook :", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer les événements pertinents
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const payment = await findPaymentByStripeId(paymentIntent.id);

        if (payment) {
            await updatePaymentStatus(payment.id, "succeeded");
            console.log(`✅ Paiement réussi pour ride #${payment.ride_id}`);
        }
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object;
        const payment = await findPaymentByStripeId(paymentIntent.id);

        if (payment) {
            await updatePaymentStatus(payment.id, "failed");
            console.warn(`❌ Paiement échoué pour ride #${payment.ride_id}`);
        }
    }

    res.status(200).json({ received: true });
};

module.exports = handleStripeWebhook;
