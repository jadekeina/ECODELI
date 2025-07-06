const path = require("path");
require("dotenv").config({
  path: process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../.env.prod")
      : path.resolve(__dirname, "../.env"),
});
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Middleware pour servir les fichiers statiques du dossier 'public'
app.use(express.static('public'));

app.use(morgan("dev"));
app.use(cors());
app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
);
app.use(express.urlencoded({ extended: true }));

// Connexion MySQL
require("./config/db");

//api-google
const distanceRoutes = require("./app/routes/distance.js");
app.use("/distance", distanceRoutes);


// Routes users
const userMeRoute = require("./app/routes/users/me");
const userRoutesGet = require("./app/routes/users/get");
const userRoutesPost = require("./app/routes/users/post");
const userPatchRoute = require("./app/routes/users/patch");

// Routes auth
const authLoginRoute = require("./app/routes/auth/login");
const authLogoutRoute = require("./app/routes/auth/logout");
const verifyEmailRoute = require("./app/routes/auth/verifyEmail");
const sendresetPasswordRoute = require("./app/routes/auth/sendResetPassword");
const resetPasswordRoute = require("./app/routes/auth/resetPassword");

// Routes livreurs
const deliveryDriverRoute = require("./app/routes/deliveryDriver/post");
const deliveryDriverPatch = require("./app/routes/deliveryDriver/patch");

// Routes prestataires
const providerRoute = require("./app/routes/provider/post");
const providerPatch = require("./app/routes/provider/patch");

// Routes commerçants
const shopOwnerRoute = require("./app/routes/shopOwner/post");
const shopOwnerPatch = require("./app/routes/shopOwner/patch");

// Routes documents
const postDocumentRoute = require("./app/routes/documents/post");
const patchDocumentRoute = require("./app/routes/documents/patch");
const getDocumentRoute = require("./app/routes/documents/get");


//Requests
const requestsRoutes = require("./app/routes/requests/post");
const requestsMyRoutes = require("./app/routes/requests/my");
const requestsPublicRoutes = require("./app/routes/requests/public");

//rides
const ridePostRoute = require("./app/routes/rides/post");
const rideGetRoute = require("./app/routes/rides/get");
const rideInvoiceRoute = require("./app/routes/rides/getInvoice");

//Payments
const stripeWebhookRoute = require("./app/routes/payments/webhook");
const stripePaymentRoute = require("./app/routes/payments/post");


// Users
app.use("/users", userMeRoute);
app.use("/users", userRoutesGet);
app.use("/users", userRoutesPost);
app.use("/users", userPatchRoute);

// Auth
app.use("/auth/login", authLoginRoute);
app.use("/auth/logout", authLogoutRoute);
app.use('/api/auth/verify-email', verifyEmailRoute);
app.use('/api/auth',sendresetPasswordRoute);
app.use('/api/auth', resetPasswordRoute);

// Livreurs
app.use("/delivery-driver", deliveryDriverRoute);
app.use("/delivery-driver", deliveryDriverPatch);

// Prestataires
app.use("/provider", providerRoute);
app.use("/provider", providerPatch);

// Commerçants
app.use("/shop-owner", shopOwnerRoute);
app.use("/shop-owner", shopOwnerPatch);

// Documents
app.use("/documents", postDocumentRoute);
app.use("/documents", patchDocumentRoute);
app.use("/documents", getDocumentRoute);

//Requests
app.use("/requests", requestsRoutes);
app.use("/requests/my", requestsMyRoutes);
app.use("/requests/public", requestsPublicRoutes);

//Warehouses
const warehousePublicRoutes = require("./app/routes/warehouses/public");
const warehousePrivateRoutes = require("./app/routes/warehouses/private");
app.use("/warehouses", warehousePublicRoutes);      // GET
app.use("/admin/warehouses", warehousePrivateRoutes); // POST, DELETE, etc.



//Ride
app.use("/rides", ridePostRoute);
app.use("/rides", rideGetRoute);
app.use("/rides", rideInvoiceRoute);

//Payments
app.use("/api/webhook/stripe", stripeWebhookRoute);
app.use("/payments", stripePaymentRoute);

// Invoices
const invoiceRoutes = require("./app/routes/invoices/get");
app.use("/invoices", invoiceRoutes);

// Emails
const emailRoutes = require("./app/routes/emails/notify");
app.use("/emails", emailRoutes);

// Status updates (dynamique selon la table)
const statusRoutes = require("./app/routes/status/patch");
app.use("/status", statusRoutes);

//storage
app.use('/storage', express.static(path.join(__dirname, 'app', 'storage')));


app.get("/", (req, res) => {
  res.send("EcoDeli API is running ✅");
});


app.listen(process.env.PORT || 3002, () => {
  console.log(`✅ Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3002}`);
});
