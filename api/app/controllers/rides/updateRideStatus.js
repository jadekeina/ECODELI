// Fichier : app/controllers/rides/updateRideStatus.js
const db = require("../../../config/db");

/**
 * Met à jour le statut d’une course.
 * @param {number} rideId - ID de la course.
 * @param {string} status - Nouveau statut à appliquer.
 */
const updateRideStatus = async (rideId, status) => {
    const [result] = await db.promise().query(
        "UPDATE rides SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, rideId]
    );

    if (result.affectedRows === 0) {
        throw new Error(`Course #${rideId} introuvable`);
    }

    return { rideId, status };
};

module.exports = updateRideStatus;
