require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Middleware pour servir les fichiers statiques du dossier 'public'
app.use(express.static('public'));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
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

// Users
app.use("/users", userMeRoute);
app.use("/users", userRoutesGet);
app.use("/users", userRoutesPost);
app.use("/users", userPatchRoute);

// Auth
app.use("/auth/login", authLoginRoute);
app.use("/auth/logout", authLogoutRoute);

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

//storage
const path = require("path");
app.use("/storage", express.static(path.join(__dirname, "app/storage")));




app.get("/", (req, res) => {
  res.send("EcoDeli API is running ✅");
});


app.listen(process.env.PORT || 3002, () => {
  console.log(`✅ Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3002}`);
});
