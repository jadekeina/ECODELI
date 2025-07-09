const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createPayment } = require("../../models/payment");
const Ride = require("../../models/ride");

/**
 * Initialise un paiement Stripe et enregistre la transaction.
 * @param {Object} data - { ride_id }
 * @returns {Promise<Object>}
 */
const payWithStripe = async ({ ride_id }) => {
    const ride = await Ride.findRideById(ride_id);
    if (!ride) throw new Error("Course introuvable");

    // 🛡️ Sécurité : arrondir et forcer un minimum de 1€ (100 centimes)
    const montantCents = Math.max(Math.round(ride.total_price * 100), 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: montantCents,
        currency: "eur",
        description: `Paiement course EcoDeli - Ride #${ride.id}`,
        metadata: {
            ride_id: ride.id,
            user_id: ride.user_id,
        },
        automatic_payment_methods: { enabled: true },
    });

    await createPayment({
        ride_id: ride.id,
        stripe_payment_id: paymentIntent.id,
        amount: ride.total_price,
        status: "pending",
    });

    return {
        clientSecret: paymentIntent.client_secret,
        ride_id: ride.id,
        amount: ride.total_price,
    };
};

module.exports = payWithStripe;
