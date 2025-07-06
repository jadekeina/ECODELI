// Fichier : api/app/controllers/payments/payWithStripe.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createPayment } = require("../../models/payment");
const Ride = require("../../models/ride");

/**
 * Initialise un paiement Stripe et enregistre la transaction.
 * @param {Object} data - { ride_id }
 * @returns {Promise<Object>}
 */
const payWithStripe = async (data) => {
    const ride = await Ride.findById(data.ride_id);
    if (!ride) throw new Error("Course introuvable");

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(ride.prix_total * 100), // en centimes
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
        amount: ride.prix_total,
        status: "pending",
    });

    return {
        clientSecret: paymentIntent.client_secret,
        ride_id: ride.id,
        amount: ride.prix_total,
    };
};

module.exports = payWithStripe;
