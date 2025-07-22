const Ride = require("../../models/ride");
const moment = require("moment");

/**
 * Crée une nouvelle course (ride) avec calcul dynamique de la commission et de la TVA.
 * @param {Object} data - Données de la course : user_id, depart_address, arrivee_address, distance_km, duree, scheduled_at, note.
 * @returns {Promise<Object>} - Objet contenant le ride_id + les données de course calculées.
 */
const createRide = async (data) => {
    const TVA_TAUX = 0.20; // 20%
    const PRIX_PAR_KM = 1.25;
    const COMMISSION_PAR_KM = 0.30; // par exemple

    const distance = parseFloat(data.distance_km);
    if (!distance || isNaN(distance) || distance <= 0) {
        throw new Error("Distance invalide");
    }

    const base_price = 4; // fixe
    const tarif = distance * PRIX_PAR_KM;
    const commission = distance * COMMISSION_PAR_KM;
    const sous_total = base_price + tarif + commission;
    const tva = TVA_TAUX * sous_total;
    const total_price = sous_total + tva;
    const scheduledDate = moment(data.scheduled_at).format("YYYY-MM-DD HH:mm:ss");

    const rideData = {
        user_id: data.user_id,
        depart_address: data.depart_address,
        arrivee_address: data.arrivee_address,
        distance_km: distance,
        duree: data.duree || null,
        base_price,
        commission,
        tva,
        total_price,
        scheduled_date: scheduledDate,
        note: data.note || "",
        status: "en_attente",
    };

    const createdRide = await Ride.create(rideData);

    return {
        ride_id: createdRide.id,
        ...rideData,
    };
};

module.exports = createRide;
