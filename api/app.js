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
const cookieParser = require('cookie-parser');
const auth = require('./app/librairies/authMiddleware');

//  Middlewares globaux
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Connexion à la base de données
require("./config/db");

//  Tâche CRON pour les paiements prestataires
const cron = require('node-cron');
const { processPendingProviderPayments } = require('./app/controllers/providerPayments/processProviderPayments');
cron.schedule('*/5 * * * *', () => {
    console.log("[Cron] Démarrage du traitement des paiements provider...");
    processPendingProviderPayments();
});

const { processPendingServicePayments } = require("./app/controllers/servicePayments/processServicePayments");

// Exécute toutes les 10 minutes
cron.schedule("*/10 * * * *", async () => {
    console.log("🕒 [CRON] Lancement processPendingServicePayments...");
    await processPendingServicePayments();
});

//  Webhook Stripe
const handleStripeWebhook = require("./app/controllers/payments/handleStripeWebhook");
app.post(
    "/webhooks/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

//  Routes publiques
app.use("/distance", require("./app/routes/distance.js"));

//  Users
app.use("/users", require("./app/routes/users/me"));
app.use("/api/users", require("./app/routes/users"));
app.use("/api/users/last", require("./app/routes/users/last"));
app.use("/users", require("./app/routes/users/get"));
app.use("/users", require("./app/routes/users/post"));
app.use("/users", require("./app/routes/users/patch"));

//  Auth
app.use("/auth/login", require("./app/routes/auth/login"));
app.use("/auth/logout", require("./app/routes/auth/logout"));
app.use("/auth/google", require("./app/routes/auth/google"));
app.use("/auth/verify-email", require("./app/routes/auth/verifyEmail"));
app.use("/auth/send-reset-password", require("./app/routes/auth/sendResetPassword"));
app.use("/auth/reset-password", require("./app/routes/auth/resetPassword"));
app.use("/auth/resend-email", require("./app/routes/auth/resend-mail"));
app.use("/auth/forgot-password", require("./app/routes/auth/forgotPassword"));

//  Stats
app.use("/api/stats/inscriptions", require("./app/routes/stats/inscriptions"));
app.use("/api/stats/ca", require("./app/routes/stats/ca"));

//  Delivery Driver
app.use("/delivery-driver", require("./app/routes/deliveryDriver/post"));
app.use("/delivery-driver", require("./app/routes/deliveryDriver/patch"));
app.use("/delivery-driver", require("./app/routes/deliveryDriver/getId"));


//Delivery Driver Payment
app.use("/delivery-driver-payments", require("./app/routes/deliveryDriverPayments/get"));
app.use("/delivery-driver-payments", require("./app/routes/deliveryDriverPayments/process"));
app.use("/delivery-driver/payments/balance", require("./app/routes/deliveryDriverPayments/balance"));

//  Providers
app.use("/provider", require("./app/routes/provider/post"));
app.use("/provider", require("./app/routes/provider/patch"));
app.use("/provider_payments", require("./app/routes/providerPayments/get"));
app.use("/requests/provider", require("./app/routes/requests/provider"));
app.use("/provider/me", require("./app/routes/provider/me"));

//  Shop Owner
app.use("/shop-owner", require("./app/routes/shopOwner/post"));
app.use("/shop-owner", require("./app/routes/shopOwner/patch"));


//  ShopOwner Requests
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/mine"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/post"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/get"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/getById"));
app.use("/shopowner-requests/en-attente", require("./app/routes/shopowner_requests/en-attente"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/status"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/assign"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/patch"));
app.use("/shopowner-requests", require("./app/routes/shopowner_requests/delete"));


//  Documents
app.use("/documents", require("./app/routes/documents/post"));
app.use("/documents", require("./app/routes/documents/patch"));
app.use("/documents", require("./app/routes/documents/get"));

//  Requests a supprimer
app.use("/requests", require("./app/routes/requests/post"));
app.use("/requests/my", require("./app/routes/requests/my"));
app.use("/requests/public", require("./app/routes/requests/public"));
app.use("/requests/provider", require("./app/routes/requests/provider"));

//Services Requests
app.use("/service_requests", require("./app/routes/service_requests/post"));
app.use("/service_requests", require("./app/routes/service_requests/getByProvider"));
app.use("/service_requests", require("./app/routes/service_requests/status"));
app.use("/service_requests", require("./app/routes/service_requests/get")); // Pour gérer GET /service_requests/:id
app.use("/service_requests", require("./app/routes/service_requests/getByClient"));


//  Warehouses
app.use("/warehouses", require("./app/routes/warehouses/public"));
app.use("/admin/warehouses", require("./app/routes/warehouses/private"));
app.use("/warehouses", require("./app/routes/warehouses/get"));

//  Rides
app.use("/rides", require("./app/routes/rides/post"));
app.use("/rides", require("./app/routes/rides/get"));
app.use("/rides", require("./app/routes/rides/getInvoice"));
app.use("/rides", require("./app/routes/rides/status"));
app.use("/rides", require("./app/routes/rides/assign"));
app.use("/rides/en-attente", require("./app/routes/rides/en-attente"));
app.use("/rides/provider", require("./app/routes/rides/providerRides"));
app.use("/rides/client", require("./app/routes/rides/clientRides"));
app.use("/rides", require("./app/routes/rides/updateStatus"));

//  Shops
app.use("/shops", require("./app/routes/shops/post"));
app.use("/shops", require("./app/routes/shops/get"));
app.use("/shops", require("./app/routes/shops/getById"));
app.use("/shops", require("./app/routes/shops/delete"));
app.use("/shops", require("./app/routes/shops/patch"));

//  Payments
app.use("/payments", require("./app/routes/payments/post"));
app.use("/payments/service", require("./app/routes/payments/services"));

//  Invoices
app.use("/invoices", require("./app/routes/invoices/get"));
app.use("/invoices", require("./app/routes/invoices/index"));

//  Emails
app.use("/emails", require("./app/routes/emails/notify"));

//  Status updates
app.use("/status", require("./app/routes/status/patch"));

//Prestations
app.use("/services", require("./app/routes/services/index"));


//  Fichiers statiques
app.use('/storage', express.static(path.join(__dirname, 'app', 'storage')));

//  Routes de test
app.get("/", (req, res) => {
    res.send("EcoDeli API is running ");
});

app.use("/admin", require("./app/routes/servicePayments/test")); // ou autre nom

app.get('/api/protected', auth, (req, res) => {
    res.json({ message: "Accès autorisé", user: req.user });
});

//  Démarrage serveur
app.listen(process.env.PORT || 3002, () => {
    console.log(` Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3002}`);
});
