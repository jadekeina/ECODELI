// Fichier : controllers/rides/getUserRides.js

const pool = require("../../../config/db");


const getUserRides = async (req, res) => {
    const userId = req.params.id;

    try {
        const [rides] = await pool.query(
            `SELECT r.*, p.status AS payment_status
       FROM rides r
       LEFT JOIN payments p ON r.id = p.ride_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
            [userId]
        );

        res.status(200).json({ rides });
    } catch (error) {
        console.error("❌ Erreur récupération des courses utilisateur :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des courses." });
    }
};

module.exports = getUserRides;
