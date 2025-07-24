// api/app/routes/shops/post.js
const express = require("express");
const router = express.Router();

// AJOUT DE LOG POUR VÉRIFIER QUEL MODULE AUTH EST CHARGÉ
const authPath = require.resolve("../../librairies/auth");
console.log("🔍 [post.js] Chargement du middleware auth depuis :", authPath);
const auth = require(authPath); // Utiliser le chemin résolu

const createShop = require("../../controllers/shops/createShop");

// Définit la route POST pour ajouter une nouvelle boutique
router.post("/", auth, createShop);

module.exports = router;
