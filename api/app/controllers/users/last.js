const express = require("express");
const router = express.Router();
const db = require("../../models/users");

router.get("/", (req, res) => {
  // Tu peux récupérer le limit en query (ex: /api/users/last?limit=10)
  const limit = Number(req.query.limit) || 5;
  db.getLastUsers(limit, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ users });
  });
});

module.exports = router;
