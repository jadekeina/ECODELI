// Fichier : app/routes/rides/assign.js

const express = require("express");
const router = express.Router();
const assignProviderToRide = require("../../controllers/rides/assignProviderToRide");

router.patch("/:id/assign", async (req, res) => {
    const { id } = req.params;
    const { provider_id } = req.body;

    if (!provider_id) {
        return res.status(400).json({ message: "provider_id requis" });
    }

    try {
        const result = await assignProviderToRide(id, provider_id);
        return res.status(200).json({ message: "Chauffeur assigné", result });
    } catch (error) {
        console.error("Erreur assignation chauffeur :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;
