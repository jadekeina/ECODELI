// Fichier : app/routes/rides/updateStatus.js
const express = require("express");
const router = express.Router();
const updateRideStatus = require("../../controllers/rides/updateRideStatus");

router.patch("/:id/status", async (req, res) => {
    const rideId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Le champ 'status' est requis." });
    }

    try {
        const result = await updateRideStatus(rideId, status);
        return res.status(200).json({ message: `Statut mis à jour`, result });
    } catch (error) {
        console.error("Erreur mise à jour statut ride :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
