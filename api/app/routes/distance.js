const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
        return res.status(400).json({ error: "Origine et destination sont requises" });
    }

    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            origin
        )}&destinations=${encodeURIComponent(destination)}&units=metric&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(500).json({ error: "Erreur depuis Google API", details: data });
        }

        res.json(data);
    } catch (error) {
        console.error("Erreur API Google:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
