// Fichier : app/controllers/rides/findRideById.js
const Ride = require("../../models/ride");

/**
 * Récupère une course (ride) par son ID.
 * @param {number} id - ID de la course à récupérer.
 * @returns {Promise<Object|null>} - La course si trouvée, sinon null.
 */
const findRideById = async (id) => {
    const [rows] = await db
        .promise()
        .query("SELECT * FROM rides WHERE id = ?", [id]);

    return rows[0];
};

