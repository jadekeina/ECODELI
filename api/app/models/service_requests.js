// models/service_requests.js
const db = require("../../config/db");

const ServiceRequest = {
    create: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO service_requests (prestation_id, client_id, date, heure, lieu, commentaire)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.query(
                query,
                [
                    data.prestation_id,
                    data.client_id,
                    data.date,
                    data.heure,
                    data.lieu,
                    data.commentaire,
                ],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result.insertId);
                }
            );
        });
    },

    findByProviderId: (providerId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT sr.*, u.firstname, u.lastname, s.type
                FROM service_requests sr
                         JOIN services s ON sr.prestation_id = s.id
                         JOIN users u ON sr.client_id = u.id
                WHERE s.provider_id = ?
                ORDER BY sr.date DESC, sr.heure DESC
            `;
            db.query(query, [providerId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    findById: (requestId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT sr.*, u.firstname AS client_firstname, u.lastname AS client_lastname, s.type AS prestation_type,
                       p.firstname AS provider_firstname, p.lastname AS provider_lastname
                FROM service_requests sr
                         JOIN services s ON sr.prestation_id = s.id
                         JOIN users u ON sr.client_id = u.id
                         LEFT JOIN provider pr ON s.provider_id = pr.id -- CORRECTION ICI : 'provider' au lieu de 'providers'
                         LEFT JOIN users p ON pr.user_id = p.id
                WHERE sr.id = ?
            `;
            db.query(query, [requestId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            });
        });
    },

    findByClientId: (clientId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT sr.*, s.type AS prestation_type,
                       pr.id AS provider_id, u_provider.firstname AS provider_firstname, u_provider.lastname AS provider_lastname
                FROM service_requests sr
                         JOIN services s ON sr.prestation_id = s.id
                         LEFT JOIN provider pr ON s.provider_id = pr.id -- CORRECTION ICI : 'provider' au lieu de 'providers'
                         LEFT JOIN users u_provider ON pr.user_id = u_provider.id
                WHERE sr.client_id = ?
                ORDER BY sr.date DESC, sr.heure DESC
            `;
            db.query(query, [clientId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
};

module.exports = ServiceRequest;
