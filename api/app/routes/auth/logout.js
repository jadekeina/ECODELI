const express = require("express");
const router = express.Router();
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const db = require("../../models/users");

router.post("/", (req, res) => {
  const { id } = req.body; // ✅ corriger ici (et pas userId)

  if (!id) {
    return res.status(400).json({ message: "ID manquant" });
  }

  db.clearUserToken(id, (err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }

    return res.status(200).json({ message: "Déconnexion réussie" });
  });
});

module.exports = router;
