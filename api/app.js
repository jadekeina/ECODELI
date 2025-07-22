const path = require("path");
require("dotenv").config({
    path: process.env.NODE_ENV === "production"
        ? path.resolve(__dirname, ".env.prod")
        : path.resolve(__dirname, ".env"),
});

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const cron = require('node-cron');
const { processPendingProviderPayments } = require('./app/controllers/providerPayments/processProviderPayments');

// Tâche cron toutes les 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log("[Cron] Démarrage du traitement des paiements provider...");
    processPendingProviderPayments();
});


const handleStripeWebhook = require("./app/controllers/payments/handleStripeWebhook");

// ✅ Webhook Stripe - doit être mis **avant** express.json()
// express.raw() met le corps brut de la requête dans req.body
app.post(
    "/webhooks/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

// ✅ Middlewares généraux (pour toutes les autres routes)
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cors());
// express.json() sans l'option 'verify' car express.raw() gère déjà le webhook
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connexion MySQL
require("./config/db");

// Routes
app.use("/distance", require("./app/routes/distance.js"));

// Users
app.use("/users", require("./app/routes/users/me"));
app.use("/users", require("./app/routes/users/get"));
app.use("/users", require("./app/routes/users/post"));
app.use("/users", require("./app/routes/users/patch"));

// Auth
app.use("/auth/login", require("./app/routes/auth/login"));
app.use("/auth/logout", require("./app/routes/auth/logout"));
app.use("/auth/verify-email", require("./app/routes/auth/verifyEmail"));
app.use("/auth/send-reset-password", require("./app/routes/auth/sendResetPassword"));
app.use("/auth/reset-password", require("./app/routes/auth/resetPassword"));
app.use("/auth/resend-email", require("./app/routes/auth/resend-mail"));
app.use("/auth/forgot-password", require("./app/routes/auth/forgotPassword"));


// Livreurs
app.use("/delivery-driver", require("./app/routes/deliveryDriver/post"));
app.use("/delivery-driver", require("./app/routes/deliveryDriver/patch"));

// Providers
app.use("/provider", require("./app/routes/provider/post"));
app.use("/provider", require("./app/routes/provider/patch"));
app.use("/provider_payments", require("./app/routes/providerPayments/get"));
app.use("/requests/provider", require("./app/routes/requests/provider"));

// Commerçants
app.use("/shop-owner", require("./app/routes/shopOwner/post"));
app.use("/shop-owner", require("./app/routes/shopOwner/patch"));

//Commerçant Demande
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/post"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/get"));

// Documents
app.use("/documents", require("./app/routes/documents/post"));
app.use("/documents", require("./app/routes/documents/patch"));
app.use("/documents", require("./app/routes/documents/get"));

// Requests
app.use("/requests", require("./app/routes/requests/post"));
app.use("/requests/my", require("./app/routes/requests/my"));
app.use("/requests/public", require("./app/routes/requests/public"));
app.use("/requests/provider", require("./app/routes/requests/provider"));

// Warehouses
app.use("/warehouses", require("./app/routes/warehouses/public"));
app.use("/admin/warehouses", require("./app/routes/warehouses/private"));
app.use("/warehouses", require("./app/routes/warehouses/get"));


// Rides
app.use("/rides", require("./app/routes/rides/post"));
app.use("/rides", require("./app/routes/rides/get"));
app.use("/rides", require("./app/routes/rides/getInvoice"));
app.use("/rides", require("./app/routes/rides/status"));
app.use("/rides", require("./app/routes/rides/assign"));
app.use("/rides/en-attente", require("./app/routes/rides/en-attente"));
app.use("/rides/provider", require("./app/routes/rides/providerRides"));
app.use("/provider_payments", require("./app/routes/providerPayments/get"));
app.use("/rides/client", require ("./app/routes/rides/clientRides"));
app.use("/rides", require("./app/routes/rides/updateStatus"));


//Shops
app.use("/shops", require("./app/routes/shops/post"));
app.use("/shops", require("./app/routes/shops/get"));


// Payments
app.use("/payments", require("./app/routes/payments/post"));

// Invoices
app.use("/invoices", require("./app/routes/invoices/get"));

// Emails
app.use("/emails", require("./app/routes/emails/notify"));

// Status updates
app.use("/status", require("./app/routes/status/patch"));

// Storage
app.use('/storage', express.static(path.join(__dirname, 'app', 'storage')));

// Default route
app.get("/", (req, res) => {
    res.send("EcoDeli API is running ✅");
});

// Start
app.listen(process.env.PORT || 3002, () => {
    console.log(`✅ Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3002}`);
});
