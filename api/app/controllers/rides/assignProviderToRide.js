// Fichier : app/controllers/rides/assignProviderToRide.js

const db = require("../../../config/db");

const assignProviderToRide = async (rideId, providerId) => {
    const [result] = await db
        .promise()
        .query("UPDATE rides SET provider_id = ? WHERE id = ?", [providerId, rideId]);

    return {
        rideId,
        providerId,
        affectedRows: result.affectedRows
    };
};

module.exports = assignProviderToRide;
