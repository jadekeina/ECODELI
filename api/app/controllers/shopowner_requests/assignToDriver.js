const pool = require('../../../config/db');

module.exports = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    const deliveryDriverId = req.user.id;

    try {
        // Vérifie si la demande existe
        const [rows] = await pool.query('SELECT * FROM shopowner_requests WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Demande commerçant introuvable.' });
        }

        // Mise à jour avec l'id du livreur et le statut
        await pool.query(
            'UPDATE shopowner_requests SET statut = ?, delivery_driver_id = ? WHERE id = ?',
            [statut, deliveryDriverId, id]
        );

        res.status(200).json({ message: 'Statut et livreur mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’assignation du livreur :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
    }
};
