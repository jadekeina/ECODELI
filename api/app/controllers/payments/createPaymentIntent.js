const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { findRideById } = require("../../models/ride");
const { createPayment } = require("../../models/payment");

/**
 * Crée un PaymentIntent pour une course (ride).
 * @param {Object} body - Doit contenir type et data.
 * @returns {Promise<Object>}
 */
const createPaymentIntent = async (body) => {
    if (body.type !== "ride") {
        throw new Error("Type de paiement non supporté");
    }

    const { ride_id, amount } = body.data || {};

    if (!ride_id) {
        const error = new Error("Champ ride_id requis");
        error.status = 400;
        throw error;
    }

    if (!amount || isNaN(amount)) {
        const error = new Error("Montant invalide");
        error.status = 400;
        throw error;
    }

    const ride = await findRideById(ride_id);
    if (!ride) {
        const error = new Error("Course introuvable");
        error.status = 404;
        throw error;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(amount), // Stripe attend un entier en centimes
        currency: "eur",
        metadata: {
            ride_id: ride_id.toString(),
        },
    });

    await createPayment({
        ride_id,
        stripe_payment_id: paymentIntent.id,
        amount: amount / 100, // Stocké en euros dans la DB
        status: "pending",
    });

    return paymentIntent;
};

module.exports = createPaymentIntent;
