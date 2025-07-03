const db = require("../../models/requests");

async function getRequestById(req, res) {
    const id = req.params.id;

    db.getRequestById(id, (err, result) => {
        if (err) {
            console.error("Erreur DB getRequestById:", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Annonce non trouvée" });
        }

        return res.status(200).json(result[0]); // ✅ renvoie un objet
    });
}

module.exports = getRequestById;
