const db = require("../../config/db");

const Service = {
    create: async (data) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO services (provider_id, type, description, price, status) VALUES (?, ?, ?, ?, ?)`,
                [data.provider_id, data.type, data.description, data.price, data.status || 'en_attente'],
                (err, result) => {
                    if (err) {
                        console.error("❌ [Service.create] Erreur SQL :", err);
                        return reject(err);
                    }
                    resolve({ id: result.insertId, ...data });
                }
            );
        });
    },

    getByProviderId: async (providerId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM services WHERE provider_id = ? ORDER BY created_at DESC`,
                [providerId],
                (err, rows) => {
                    if (err) {
                        console.error("❌ [Service.getByProviderId] Erreur SQL :", err);
                        return reject(err);
                    }
                    resolve(rows);
                }
            );
        });
    },

    getById: async (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM services WHERE id = ?`,
                [id],
                (err, rows) => {
                    if (err) {
                        console.error("❌ [Service.getById] Erreur SQL :", err);
                        return reject(err);
                    }
                    resolve(rows[0]);
                }
            );
        });
    },

    update: async (id, data) => {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            if (data.type !== undefined) {
                fields.push("type = ?");
                values.push(data.type);
            }
            if (data.description !== undefined) {
                fields.push("description = ?");
                values.push(data.description);
            }
            if (data.price !== undefined) {
                fields.push("price = ?");
                values.push(data.price);
            }
            if (data.status !== undefined) {
                fields.push("status = ?");
                values.push(data.status);
            }

            if (fields.length === 0) {
                return reject(new Error("No fields to update"));
            }

            values.push(id);

            db.query(
                `UPDATE services SET ${fields.join(", ")} WHERE id = ?`,
                values,
                (err, result) => {
                    if (err) {
                        console.error("❌ [Service.update] Erreur SQL :", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    },

    delete: async (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM services WHERE id = ?`,
                [id],
                (err, result) => {
                    if (err) {
                        console.error("❌ [Service.delete] Erreur SQL :", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    }
};

module.exports = Service;
