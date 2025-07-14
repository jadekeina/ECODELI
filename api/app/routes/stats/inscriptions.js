const express = require("express");
const router = express.Router();
const statsModel = require("../../models/users"); 
// Retourne les inscriptions pour les 7 derniers jours
router.get("/semaine", (req, res) => {
  statsModel.countInscriptionsParJourSemaine((err, results) => {
    if (err) {
      console.error("❌ Erreur SQL inscriptions semaine:", err);
      return res.status(500).json({ error: err.message });
    }

    const now = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const found = results.find(r => {
        // Attention au format de r.day (parfois string ou Date)
        return (typeof r.day === "string" ? r.day : r.day.toISOString().slice(0, 10)) === dayStr;
      });
      days.push(found ? found.count : 0);
    }

    res.json({ data: days });
  });
});

module.exports = router;
