const db = require("../../config/db"); // Votre objet db existant

const ShopOwnerRequest = {
    create: async (data) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO shopowner_requests (
                user_id, type, title, description, poids, longueur, largeur, hauteur,
                photo, adresse_livraison, date_livraison, heure_livraison, prix, destinataire_nom, destinataire_prenom
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const params = [
                data.user_id,
                data.type,
                data.title,
                data.description,
                data.poids,
                data.longueur,
                data.largeur,
                data.hauteur,
                data.photo,
                data.adresse_livraison,
                data.date_livraison,
                data.heure_livraison,
                data.prix,
                data.destinataire_nom,
                data.destinataire_prenom,
            ];

            // Envelopper db.query dans une Promise
            db.query(query, params, (err, result) => {
                if (err) {
                    console.error("❌ [ShopOwnerRequest.create] Erreur SQL :", err);
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    },

    findAll: async () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM shopowner_requests`;
            // Envelopper db.query dans une Promise
            db.query(query, (err, rows) => {
                if (err) {
                    console.error("❌ [ShopOwnerRequest.findAll] Erreur SQL :", err);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },

    findAllForDeliveryDrivers: async () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM shopowner_requests WHERE statut = 'en_attente'`;
            // Envelopper db.query dans une Promise
            db.query(query, (err, rows) => {
                if (err) {
                    console.error("❌ [ShopOwnerRequest.findAllForDeliveryDrivers] Erreur SQL :", err);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },
};

module.exports = ShopOwnerRequest;
