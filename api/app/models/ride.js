// Fichier : app/models/ride.js

const db = require("../../config/db");

const Ride = {
    create: async (data) => {
        const [result] = await db.promise().query(
            `INSERT INTO rides (
                user_id, depart_address, arrivee_address, distance_km, duree,
                base_price, commission, tva, total_price, scheduled_date, note, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.user_id,
                data.depart_address,
                data.arrivee_address,
                data.distance_km,
                data.duree,
                data.prix_base,
                data.commission,
                data.tva,
                data.prix_total,
                data.scheduled_at,
                data.note,
                data.status || "en_attente"
            ]
        );
        return { id: result.insertId, ...data };
    },

    findRideById: async (id) => {
        const [rows] = await db.promise().query(`SELECT * FROM rides WHERE id = ?`, [id]);
        return rows[0];
    },


    getAll: async () => {
        return await db.promise().query(`SELECT * FROM rides ORDER BY created_at DESC`);
    },
};

module.exports = Ride;
