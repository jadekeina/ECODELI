const requestModel = require("../../models/requests");
const { jsonResponse } = require("../../librairies/response");

async function postRequest(req, res) {
    const data = req.body;
    const userId = req.userId;

    const request = {
        ...data,
        user_id: req.user?.id,
    };

    console.log("👤 [postRequest] Utilisateur connecté ID:", req.user?.id);

    requestModel.createRequest(request, (err, result) => {
        if (err) {
            console.error("Erreur création request :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        return res.status(201).json({ message: "Demande client créée ✅", id: result.insertId });
    });
}

module.exports = postRequest;
