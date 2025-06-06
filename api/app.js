const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion MySQL
require("./config/db");



// Routes users
const userRoutesGet = require("./app/routes/users/get");
const userRoutesPost = require("./app/routes/users/post");
const userMeRoute = require("./app/routes/users/me");
const userPatchRoute = require("./app/routes/users/patch");

// Routes auth
const authLoginRoute = require("./app/routes/auth/login");
const authLogoutRoute = require("./app/routes/auth/logout");

// users
app.use("/users", userRoutesGet);
app.use("/users", userRoutesPost);
app.use("/users", userMeRoute);
app.use("/users", userPatchRoute);


// Auth
app.use("/auth/login", authLoginRoute);
app.use("/auth/logout", authLogoutRoute);

// Test
app.get("/", (req, res) => {
  res.send("✅ API EcoDeli is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Serveur EcoDeli lancé sur http://localhost:${process.env.PORT || 3000}`);
});
