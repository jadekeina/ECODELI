// routes/users/last.js
const express = require("express");
const router = express.Router();
const db = require("../../models/users");

router.get("/", (req, res) => {
  console.log("🔍 Route /api/users/last appelée avec limit:", req.query.limit);
  const limit = parseInt(req.query.limit) || 5;
  
  db.getLastUsers(limit, (err, users) => {
    if (err) {
      console.error("❌ Erreur getLastUsers:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    console.log("✅ Utilisateurs récupérés:", users);
    res.json({ users });
  });
});

module.exports = router;
