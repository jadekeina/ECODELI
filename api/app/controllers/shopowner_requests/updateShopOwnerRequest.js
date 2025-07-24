// api/app/controllers/shopowner_requests/updateShopOwnerRequest.js
const db = require("../../../config/db").promise(); // Assurez-vous que .promise() est bien utilisé si vous utilisez await db.query()

module.exports = async (req, res) => {
    const requestId = req.params.id;
    const userId = req.user.id;
    const {
        title, description, poids, longueur, largeur, hauteur,
        destinataire_nom, destinataire_prenom,
        adresse_livraison,
        date_livraison,
        heure_livraison,
        prix
    } = req.body;

    try {
        const [rows] = await db.query(
            `UPDATE shopowner_requests SET title=?, description=?, poids=?, longueur=?, largeur=?, hauteur=?,
                                           destinataire_nom=?, destinataire_prenom=?, adresse_livraison=?, date_livraison=?, heure_livraison=?, prix=? WHERE id=? AND user_id=?`, // <-- CORRECTION ICI dans la requête SQL
            [title, description, poids, longueur, largeur, hauteur,
                destinataire_nom, destinataire_prenom, adresse_livraison, date_livraison, heure_livraison, prix, requestId, userId] // <-- CORRECTION ICI dans les paramètres
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: "Annonce non trouvée ou accès interdit." });
        }

        res.status(200).json({ message: "Annonce mise à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};
