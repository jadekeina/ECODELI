const express = require("express");
const router = express.Router();
const statsModel = require("../../models/stats");

// Donne le vrai CA de la semaine (ou fake s’il n’y en a pas)
router.get("/ca-semaine", (req, res) => {
  statsModel.getChiffreAffairesSemaine((err, ca) => {
    if (err) {
      // Si la table payments n’existe pas ou autre erreur, on renvoie un CA fake pour l’instant
      return res.json({ chiffreAffaires: 1550 + Math.floor(Math.random() * 500) });
    }
    res.json({ chiffreAffaires: ca });
  });
});

// Pour du FAKE en mode dev (CA + courbe random pour un graph)
router.get("/fake", (req, res) => {
  const chiffreAffaires = 1200 + Math.floor(Math.random() * 1000);
  const chart = Array.from({ length: 7 }, () => 100 + Math.floor(Math.random() * 900));
  const evolution = Math.floor(Math.random() * 41) - 20; // -20% à +20%
  res.json({ chiffreAffaires, chart, evolution });
});

module.exports = router;
