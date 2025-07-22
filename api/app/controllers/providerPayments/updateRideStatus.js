const Ride = require("../../models/ride");
const ProviderPayment = require("../../models/providerPayment"); // Modèle à créer

const updateRideStatus = async (rideId, status) => {
    const [result] = await db.promise().query(
        "UPDATE rides SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, rideId]
    );

    if (result.affectedRows === 0) {
        throw new Error(`Course #${rideId} introuvable`);
    }

    // Si la course est terminée, on crée le paiement prestataire
    if (status === "terminee") {
        const ride = await Ride.findRideById(rideId);

        if (!ride.provider_id) {
            throw new Error("La course n'a pas de prestataire assigné.");
        }

        const providerPaymentData = {
            provider_id: ride.provider_id,
            ride_id: ride.id,
            amount: ride.total_price * 0.7, // exemple : 70% du total_price
            status: "en_attente",
            method: "virement", // ou autre méthode
        };

        await ProviderPayment.create(providerPaymentData);
    }

    return { rideId, status };
};

module.exports = updateRideStatus;
