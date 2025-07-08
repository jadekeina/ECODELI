// Fichier : app/controllers/status/updateStatus.js

const db = require("../../config/db");

/**
 * Met à jour le champ "status" d'une entité donnée.
 * @param {string} table - Nom de la table (ex: "rides", "users")
 * @param {number} id - ID de l'entité
 * @param {string} status - Nouveau statut
 */
const updateStatus = async (table, id, status) => {
    const allowedTables = ["rides", "payments", "users"];
    if (!allowedTables.includes(table)) {
        throw new Error("Table non autorisée");
    }

    await db.promise().query(
        `UPDATE ?? SET status = ? WHERE id = ?`,
        [table, status, id]
    );
};

module.exports = updateStatus;
