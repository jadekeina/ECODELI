
const db = require("../../../config/db").promise();

module.exports = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.params.id;

        const [rows] = await db.query("DELETE FROM shopowner_requests WHERE id = ? AND user_id = ?", [requestId, userId]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: "Annonce introuvable ou accès interdit." });
        }

        res.status(200).json({ message: "Annonce supprimée avec succès." });
    } catch (err) {
        console.error("[deleteShopOwnerRequest] Erreur :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
