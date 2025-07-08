const Ride = require("../../models/ride");

/**
 * Crée une nouvelle course (ride) avec calcul dynamique de la commission et de la TVA.
 * @param {Object} data - Données de la course : user_id, depart_address, arrivee_address, distance_km, duree, scheduled_at, note.
 * @returns {Promise<Object>} - Objet contenant le ride_id + les données de course calculées.
 */
const createRide = async (data) => {
    const COMMISSION_FIXE = 3; // en euros
    const TVA_TAUX = 0.20; // 20%
    const PRIX_PAR_KM = 1.2;

    const distance = parseFloat(data.distance_km);
    if (isNaN(distance)) {
        throw new Error("Distance invalide");
    }

    const prixBase = +(distance * PRIX_PAR_KM).toFixed(2);
    const commission = COMMISSION_FIXE;
    const prixAvecCommission = prixBase + commission;
    const tva = +(prixAvecCommission * TVA_TAUX).toFixed(2);
    const prixTotal = +(prixAvecCommission + tva).toFixed(2);

    const rideData = {
        user_id: data.user_id,
        depart_address: data.depart_address,
        arrivee_address: data.arrivee_address,
        distance_km: distance,
        duree: data.duree || null,
        base_price: prixBase,
        commission,
        tva,
        total_price: prixTotal,
        scheduled_date: data.scheduled_at,
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
