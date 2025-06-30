const requestModel = require("../../models/requests");

async function getPublicRequests(req, res) {
    requestModel.getAllRequests((err, results) => {
        if (err) {
            console.error("Erreur récupération demandes publiques :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        return res.status(200).json({ message: "Demandes publiques récupérées ✅", data: results });
    });
}

module.exports = getPublicRequests;
