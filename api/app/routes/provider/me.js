const express = require("express");
const router = express.Router();
const auth = require("../../librairies/authMiddleware");
const connection = require("../../../config/db");

router.get("/", auth, (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT * FROM provider WHERE user_id = ?";
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun provider trouvé." });
        }

        return res.json({ provider: results[0] });
    });
});

module.exports = router;
