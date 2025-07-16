const Ride = require("../../models/ride");

const assignProviderToRide = async (rideId, providerId) => {
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

    return {
        rideId,
        providerId,
        affectedRows: result.affectedRows,
    };
};

module.exports = assignProviderToRide;
