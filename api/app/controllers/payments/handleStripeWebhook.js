const path = require("path");
require("dotenv").config({
    path: process.env.NODE_ENV === "production"
        ? path.resolve(__dirname, "../../../.env.prod")
        : path.resolve(__dirname, "../../../.env"),
});

// Fichier : api/app/controllers/payments/handleStripeWebhook.js

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Importe les fonctions nécessaires de ton modèle de paiement
const {
    findPaymentByStripeId,
    updatePaymentStatus,
    // createPayment n'est plus utilisé ici pour la production
} = require("../../models/payment");

// Importe les autres fonctions de traitement
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
        console.log("🔍 Recherche du paiement dans la base avec Stripe ID :", paymentIntent.id);
        let payment = await findPaymentByStripeId(paymentIntent.id);

        if (!payment) {
            // Pour la production, si le paiement n'est pas trouvé, c'est une erreur.
            // Cela signifie que le paiement n'a pas été enregistré initialement dans ta BDD.
            console.error("⚠️ Erreur critique : Paiement introuvable dans la BDD pour l'ID Stripe :", paymentIntent.id);
            // Tu peux choisir de renvoyer un 404, ou un 200 pour éviter les retries de Stripe,
            // mais il est important de logguer cette erreur pour investigation.
            return res.status(404).json({ message: "Paiement non trouvé dans notre système." });
        }

        // Si le paiement est trouvé, on procède au traitement habituel
        if (event.type === "payment_intent.succeeded") {
            console.log("✅ Traitement du paiement réussi...");
            await updatePaymentStatus(payment.id, "succeeded");
            await updateStatus("rides", payment.ride_id, "acceptee");
            await generateInvoice("ride", payment.ride_id);
            await sendConfirmationEmail("ride", payment.ride_id);
        } else if (event.type === "payment_intent.failed") { // Ajout de else if pour une meilleure clarté
            console.log("❌ Traitement d'un échec de paiement...");
            await updatePaymentStatus(payment.id, "failed");
        }

        if (!sig) {
            console.warn("⚠️ Signature Stripe manquante !");
            return res.status(400).send("Signature manquante");
        }

        console.log("📬 Webhook traité avec succès.");
        return res.status(200).json({ received: true });

    } catch (error) {
        console.error("💥 Erreur traitement webhook Stripe :", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = handleStripeWebhook;
