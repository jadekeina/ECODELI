const requestModel = require("../../models/requests");
const { jsonResponse } = require("../../librairies/response");

async function postRequest(req, res) {
    const data = req.body;
    const userId = req.user?.id;

    const request = {
        ...data,
        user_id: userId,
    };

    // 🔒 Image par défaut si aucune image envoyée
    if (!request.photo || request.photo.trim() === "") {
        request.photo = "/storage/default-images/requests.webp";
    }

    console.log("👤 [postRequest] Utilisateur connecté ID:", userId);

    requestModel.createRequest(request, (err, result) => {
        if (err) {
            console.error("Erreur création request :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        return res.status(201).json({ message: "Demande client créée ✅", id: result.insertId });
    });
}

module.exports = postRequest;
