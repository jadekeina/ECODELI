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


app.use(cookieParser());


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
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connexion MySQL
require("./config/db");

// Routes
app.use("/distance", require("./app/routes/distance.js"));

// Users

app.use("/api/users/last", require("./app/routes/users/last"));
app.use("/users", require("./app/routes/users/get"));
app.use("/users", require("./app/routes/users/me"));
app.use("/users", require("./app/routes/users"));




//Stats
app.use("/api/stats/inscriptions", require("./app/routes/stats/inscriptions"));
app.use("/api/stats/ca", require("./app/routes/stats/ca"));




// Auth
app.use("/auth/login", require("./app/routes/auth/login"));
app.use("/auth/logout", require("./app/routes/auth/logout"));
app.use("/auth/google", require("./app/routes/auth/google"));
app.use("/auth/verify-email", require("./app/routes/auth/verifyEmail"));
app.use("/auth/send-reset-password", require("./app/routes/auth/sendResetPassword"));
app.use("/auth/reset-password", require("./app/routes/auth/resetPassword"));
app.use("/auth/resend-email", require("./app/routes/auth/resend-mail"));
app.use("/auth/forgot-password", require("./app/routes/auth/forgotPassword"));


// Livreurs
app.use("/delivery-driver", require("./app/routes/deliveryDriver/post"));
app.use("/delivery-driver", require("./app/routes/deliveryDriver/patch"));

// Prestataires
app.use("/provider", require("./app/routes/provider/post"));
app.use("/provider", require("./app/routes/provider/patch"));

// Commerçants
app.use("/shop-owner", require("./app/routes/shopOwner/post"));
app.use("/shop-owner", require("./app/routes/shopOwner/patch"));

// Documents
app.use("/documents", require("./app/routes/documents/post"));
app.use("/documents", require("./app/routes/documents/patch"));
app.use("/documents", require("./app/routes/documents/get"));

// Requests
app.use("/requests", require("./app/routes/requests/post"));
app.use("/requests/my", require("./app/routes/requests/my"));
app.use("/requests/public", require("./app/routes/requests/public"));

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

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});


app.listen(process.env.PORT || 3002, () => {
    console.log(`✅ Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3002}`);
});
