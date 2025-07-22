const db = require("../../../config/db");
const Ride = require("../../models/ride");

const assignProviderToRide = async (rideId, userId) => {
    // ✅ Utilise .promise() ici pour une requête compatible await
    console.log("🧪 Recherche provider pour user_id =", userId);

    const [rows] = await db.promise().query(
        "SELECT id FROM provider WHERE user_id = ?",
        [userId]
    );

    if (!rows.length) {
        throw new Error("Aucun profil provider trouvé pour cet utilisateur");
    }

    const providerId = rows[0].id;

    const ride = await Ride.getRideStatusAndProvider(rideId);

    if (!ride) {
        throw new Error("Course introuvable");
    }

    if (ride.provider_id !== null) {
        throw new Error("Course déjà assignée à un autre prestataire");
    }

    if (ride.status !== "en_attente") {
        throw new Error(`Impossible d’assigner une course avec le statut "${ride.status}"`);
    }

    const result = await Ride.assignProvider(rideId, providerId);

    if (result.affectedRows === 0) {
        throw new Error("La mise à jour a échoué, aucune ligne modifiée.");
    }

    return {
        rideId,
        providerId,
        affectedRows: result.affectedRows,
    };
};

module.exports = assignProviderToRide;
