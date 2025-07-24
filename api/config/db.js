const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({
  path: process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../.env.prod")
      : path.resolve(__dirname, "../.env"),
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err.message); // 👈 ici s'affiche le vrai message
    return;
  }
  console.log("✅ Connecté à la base de données MySQL !");
});

module.exports = connection;