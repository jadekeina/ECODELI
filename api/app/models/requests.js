const db = require("../../config/db");

exports.createRequest = (request, callback) => {
    const query = `
        INSERT INTO requests (
            user_id, type, titre, description, photo,
            longueur, largeur, poids, prix, prix_suggere,
            heure_depart, heure_arrivee,
            budget, tarif_prestataire,
            taille_box, duree,
            adresse_depart, adresse_arrivee, date_demande
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const {
        user_id, type, titre, description, photo,
        longueur, largeur, poids, prix, prix_suggere,
        heure_depart, heure_arrivee,
        budget, tarif_prestataire,
        taille_box, duree,
        adresse_depart, adresse_arrivee, date_demande
    } = request;

    db.query(
        query,
        [
            user_id, type, titre, description, photo,
            longueur, largeur, poids, prix, prix_suggere,
            heure_depart, heure_arrivee,
            budget, tarif_prestataire,
            taille_box, duree,
            adresse_depart, adresse_arrivee, date_demande
        ],
        callback
    );
};

// 🔍 Pour GET /requests/my
exports.getRequestsByUserId = (userId, callback) => {
    db.query("SELECT * FROM requests WHERE user_id = ?", [userId], callback);
};

// 🔍 Pour GET /requests/public
exports.getAllRequests = (callback) => {
    db.query("SELECT * FROM requests ORDER BY created_at DESC", callback);
};

// 🔍 Pour GET by Id /requests/public

exports.getRequestById = (id, callback) => {
    const sql = "SELECT * FROM requests WHERE id = ?";
    db.query(sql, [id], callback);
};


