const db = require("../../../config/db");

/**
 * Met à jour dynamiquement le statut d'une entité (ex: ride, booking, delivery)
 * @param {string} tableName - ex: "rides"
 * @param {number} id
 * @param {string} newStatus
 */
const updateStatus = async (tableName, id, newStatus) => {
    const [result] = await db.promise().query(
        `UPDATE ?? SET status = ? WHERE id = ?`,
        [tableName, newStatus, id]
    );
    return result;
};

module.exports = updateStatus;
