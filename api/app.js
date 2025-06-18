const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const morgan = require("morgan");
app.use(morgan("dev")); // 👈 affichera toutes les requêtes entrantes


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion MySQL
require("./config/db");


// Routes users
const userMeRoute = require("./app/routes/users/me");
const userRoutesGet = require("./app/routes/users/get");
const userRoutesPost = require("./app/routes/users/post");
const userPatchRoute = require("./app/routes/users/patch");

// Routes auth
const authLoginRoute = require("./app/routes/auth/login");
const authLogoutRoute = require("./app/routes/auth/logout");


//Routes livreurs
const deliveryDriverRoute = require("./app/routes/deliveryDriver/post");


// users
app.use("/users", userMeRoute);
app.use("/users", userRoutesGet);
app.use("/users", userRoutesPost);
app.use("/users", userPatchRoute);


// Auth
app.use("/auth/login", authLoginRoute); // Ici la route est '/auth/login'
app.use("/auth/logout", authLogoutRoute); // Ici la route est '/auth/logout'

//Livreurs
app.use("/delivery-driver", deliveryDriverRoute);

// Test
app.get("/", (req, res) => {
  res.send("✅ API EcoDeli is running");
});

app.get("/test-log", (req, res) => {
  console.log("=== ROUTE /test-log appelée ===");
  res.send("OK");
});


app.listen(process.env.PORT || 3002, () => {
  console.log(`✅ Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3002}`);
});