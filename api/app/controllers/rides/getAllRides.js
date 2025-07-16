const Ride = require("../../models/ride");

const getAllRides = async (user) => {
    // Autoriser seulement les admin ou providers
    if (!user || !["admin", "provider"].includes(user.role)) {
        const error = new Error("Accès interdit");
        error.statusCode = 403;
        throw error;
    }

    return await Ride.getAll();
};

module.exports = getAllRides;
