const db = require("../../../config/db");
const ProviderPayment = require("../../models/providerPayment");
const Ride = require("../../models/ride");

/**
 * Met à jour le statut d’une course.
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 */
const updateRideStatus = async (req, res) => {
    const rideId = req.params.id;
    const { status: newStatus, provider_user_id } = req.body;

    console.log(`[Backend - updateRideStatus] Tentative de mise à jour de la course ${rideId} au statut '${newStatus}'.`);
    if (newStatus === 'acceptee') {
        console.log(`[Backend - updateRideStatus] Statut 'acceptee' détecté. provider_user_id fourni: ${provider_user_id}`);
    }

    try {
        let query, params;

        if (newStatus === 'acceptee' && provider_user_id !== undefined && provider_user_id !== null) {
            // Trouver le provider_id correspondant au user_id
            const findProviderQuery = `SELECT id FROM provider WHERE user_id = ?`;
            const [providerRows] = await db.promise().query(findProviderQuery, [provider_user_id]);

            if (providerRows.length === 0) {
                console.error(`[Backend - updateRideStatus] Erreur: Aucun prestataire trouvé pour user_id: ${provider_user_id}`);
                return res.status(404).json({ message: "Prestataire non trouvé pour l'utilisateur fourni." });
            }

            const providerId = providerRows[0].id;
            console.log(`[Backend - updateRideStatus] provider_id trouvé: ${providerId} pour user_id: ${provider_user_id}`);

            // Mettre à jour le statut ET assigner le provider
            query = `UPDATE rides SET status = ?, provider_id = ? WHERE id = ?`;
            params = [newStatus, providerId, rideId];
        } else {
            // Pour les autres statuts
            query = `UPDATE rides SET status = ? WHERE id = ?`;
            params = [newStatus, rideId];
        }

        const [results] = await db.promise().query(query, params);

        if (results.affectedRows === 0) {
            console.warn(`[Backend - updateRideStatus] Aucune ligne affectée pour la course ${rideId}.`);
            return res.status(404).json({ message: "Course non trouvée ou statut déjà à jour." });
        }

        console.log(`[Backend - updateRideStatus] Course ${rideId} mise à jour au statut '${newStatus}'.`);

        // Si statut terminé, créer un paiement provider automatiquement
        if (newStatus === 'terminee') {
            const ride = await Ride.findRideById(rideId);
            if (!ride) {
                return res.status(404).json({ message: `Course #${rideId} introuvable pour paiement provider` });
            }
            if (!ride.provider_id) {
                return res.status(400).json({ message: `Course #${rideId} sans prestataire assigné` });
            }

            try {
                const payment = await ProviderPayment.create({
                    provider_id: ride.provider_id,
                    ride_id: ride.id,
                    amount: ride.total_price || 0,
                    status: "en_attente",
                    method: "virement",
                    payment_date: null,
                });
                console.log(`[Backend - updateRideStatus] Paiement provider créé pour la course ${rideId}:`, payment);
            } catch (err) {
                console.error(`[Backend - updateRideStatus] Erreur lors de la création du paiement pour la course ${rideId}:`, err);
                // tu peux choisir ici si tu renvoies une erreur ou juste loguer sans bloquer
            }
        }


        return res.status(200).json({ message: "Statut de la course mis à jour." });

    } catch (error) {
        console.error("[Backend - updateRideStatus] Erreur serveur lors de la mise à jour du statut :", error);
        return res.status(500).json({ message: "Erreur serveur lors de la mise à jour du statut.", error: error.message });
    }
};

module.exports = updateRideStatus;
