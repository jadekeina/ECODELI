const db = require("../../models/warehouses");
const { jsonResponse } = require("../../librairies/response");

async function createWarehouse(req, res) {
    const user = req.user;

    if (!user || user.role !== "admin") {
        return jsonResponse(res, 403, {}, { message: "Accès refusé. Réservé aux administrateurs." });
    }

    const { title, size_m2, phone, address } = req.body;

    if (!title || !address) {
        return jsonResponse(res, 400, {}, { message: "Champs requis manquants : titre ou adresse." });
    }

    const photo = "/storage/default-images/warehouse.webp";

    const sql = `
        INSERT INTO warehouse (title, size_m2, phone, address, photo)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, size_m2 || null, phone || null, address, photo], (err, result) => {
        if (err) {
            console.error("Erreur lors de la création de l'entrepôt :", err);
            return jsonResponse(res, 500, {}, { message: "Erreur serveur" });
        }

        return jsonResponse(res, 201, {}, {
            message: "Entrepôt créé avec succès ✅",
            id: result.insertId
        });
    });
}

module.exports = createWarehouse;
