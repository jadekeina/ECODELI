const Ride = require("../../models/ride");

const getRidesEnAttente = async () => {
    return await Ride.getEnAttente();
};

module.exports = getRidesEnAttente;
