const db = require("../../config/db"); // Votre objet db existant

const ShopOwnerRequest = {
    create: async (data) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO shopowner_requests (
                user_id, type, title, description, poids, longueur, largeur, hauteur,
                photo, adresse_livraison, date_livraison, heure_livraison, prix,
                destinataire_nom, destinataire_prenom, shop_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
                data.shop_id
            ];

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
            db.query(query, (err, rows) => {
                if (err) {
                    console.error("❌ [ShopOwnerRequest.findAll] Erreur SQL :", err);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },

    findAllForDeliveryDrivers: async (deliveryDriverId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    s.*,
                    sh.name AS shop_name,
                    sh.address AS shop_address
                FROM
                    shopowner_requests s
                        LEFT JOIN
                    shops sh ON s.shop_id = sh.id
                WHERE
                    (s.statut = 'en_attente' AND s.delivery_driver_id IS NULL) OR
                    (s.statut = 'en_cours' AND s.delivery_driver_id = ?) OR
                    (s.statut = 'terminee' AND s.delivery_driver_id = ?)
                ORDER BY
                    s.id DESC
            `;
            const params = [deliveryDriverId, deliveryDriverId];

            db.query(query, params, (err, rows) => {
                if (err) {
                    console.error("❌ [ShopOwnerRequest.findAllForDeliveryDrivers] Erreur SQL :", err);
                    return reject(err);
                }
                // CORRECTION ICI : Retourne directement le tableau de lignes 'rows'
                resolve(rows);
            });
        });
    },
};

module.exports = ShopOwnerRequest;
