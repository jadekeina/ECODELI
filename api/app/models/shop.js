// app/models/shop.js
const db = require("../../config/db"); // Assurez-vous que le chemin vers votre connexion DB est correct

const Shop = {
    // Méthode pour trouver une boutique par son ID
    findById: (shopId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM shops
                WHERE id = ?
            `;
            db.query(query, [shopId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            });
        });
    },

    // Méthode pour trouver toutes les boutiques par l'ID du propriétaire
    findByOwnerId: (ownerId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM shops
                WHERE shop_owner_id = ?
            `;
            db.query(query, [ownerId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // NOUVELLE MÉTHODE : update
    // Met à jour les informations d'une boutique par son ID
    update: (shopId, data) => {
        return new Promise((resolve, reject) => {
            // Construire la partie SET de la requête SQL dynamiquement
            const fields = [];
            const values = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    fields.push(`${key} = ?`);
                    values.push(data[key]);
                }
            }

            if (fields.length === 0) {
                return resolve({ affectedRows: 0 }); // Rien à mettre à jour
            }

            const query = `
                UPDATE shops
                SET ${fields.join(', ')}
                WHERE id = ?
            `;
            values.push(shopId); // Ajouter l'ID à la fin des valeurs

            db.query(query, values, (err, result) => {
                if (err) return reject(err);
                resolve(result); // result.affectedRows indiquera si une ligne a été mise à jour
            });
        });
    },

    // NOUVELLE MÉTHODE : delete
    // Supprime une boutique par son ID
    delete: (shopId) => {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM shops
                WHERE id = ?
            `;
            db.query(query, [shopId], (err, result) => {
                if (err) return reject(err);
                resolve(result); // result.affectedRows indiquera si une ligne a été supprimée
            });
        });
    },
};

module.exports = Shop;
