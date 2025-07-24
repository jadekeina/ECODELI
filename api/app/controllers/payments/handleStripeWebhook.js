const path = require("path");
require("dotenv").config({
    path: process.env.NODE_ENV === "production"
        ? path.resolve(__dirname, "../../../.env.prod")
        : path.resolve(__dirname, "../../../.env"),
});

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const {
    findPaymentByStripeId,
    updatePaymentStatus,
} = require("../../models/payment");

const ServicePayment = require("../../models/servicePayment");
const updateStatus = require("../status/updateStatus");
const generateInvoice = require("../invoices/generateInvoice");
const sendConfirmationEmail = require("../emails/sendConfirmationEmail");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handleStripeWebhook = async (req, res) => {
    console.log("📩 Webhook Stripe reçu");
    console.log("📨 Signature Stripe:", req.headers["stripe-signature"]);
    console.log("📨 Raw body:", req.body?.toString()?.slice(0, 100) + "...");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log(`📦 Type d’événement Stripe : ${event.type}`);
    } catch (err) {
        console.error("❌ Erreur vérification signature webhook :", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const paymentIntent = event?.data?.object;

    if (!paymentIntent) {
        console.warn("⚠️ paymentIntent manquant dans l'événement reçu :", event);
        return res.status(400).json({ error: "Webhook invalide, paymentIntent manquant." });
    }

    try {
        const metadata = paymentIntent.metadata || {};

        // 🔁 PRESTATION CLIENT
        if (metadata.request_type === "service") {
            console.log("🔍 Paiement de prestation détecté");
            const payment = await ServicePayment.findByStripePaymentId(paymentIntent.id);

            if (!payment) {
                console.warn("⚠️ Paiement prestation introuvable :", paymentIntent.id);
                return res.status(404).json({ message: "Paiement prestation introuvable" });
            }

            if (event.type === "payment_intent.succeeded") {
                await ServicePayment.updateStatus(payment.id, "effectue", new Date());
                await generateInvoice({ type: "service_request", id: payment.request_id });
                await sendConfirmationEmail("service_request", payment.request_id);
                console.log("✅ Prestation payée, facture générée, mail envoyé.");
            }

            return res.status(200).json({ received: true });
        }

        // 🛣️ COURSE RIDE
        console.log("🔍 Recherche du paiement RIDE avec Stripe ID :", paymentIntent.id);
        const payment = await findPaymentByStripeId(paymentIntent.id);

        if (!payment) {
            console.error("⚠️ Paiement ride introuvable :", paymentIntent.id);
            return res.status(404).json({ message: "Paiement ride non trouvé" });
        }

        if (event.type === "payment_intent.succeeded") {
            console.log("✅ Paiement confirmé pour une course");
            await updatePaymentStatus(payment.id, "succeeded");
            await updateStatus("rides", payment.ride_id, "acceptee");
            await generateInvoice("ride", payment.ride_id);
            await sendConfirmationEmail("ride", payment.ride_id);
            console.log("📧 Email envoyé + Facture générée (ride)");
        } else if (event.type === "payment_intent.failed") {
            console.log("❌ Paiement échoué (ride)");
            await updatePaymentStatus(payment.id, "failed");
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("💥 Erreur traitement webhook Stripe :", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = handleStripeWebhook;