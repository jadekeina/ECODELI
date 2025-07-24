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

// 🔍 Pour l'admin : récupérer toutes les annonces avec infos utilisateur
exports.getAllRequestsWithUser = (callback) => {
    const sql = `
        SELECT 
            r.id, r.titre, r.description, r.photo, r.type,
            r.longueur, r.largeur, r.poids, r.prix, r.prix_suggere,
            r.heure_depart, r.heure_arrivee, r.budget, r.tarif_prestataire,
            r.taille_box, r.duree, r.adresse_depart, r.adresse_arrivee,
            r.date_demande, r.created_at,
            u.firstname, u.lastname, u.mail, u.profilpicture, u.id as user_id
        FROM requests r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    `;
    db.query(sql, callback);
};

// 🗑️ Pour supprimer une annonce (admin)
exports.deleteRequest = (requestId, callback) => {
    const sql = "DELETE FROM requests WHERE id = ?";
    db.query(sql, [requestId], callback);
};

// 📊 Compter le nombre total d'annonces (pour stats admin)
exports.countAllRequests = (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM requests";
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].count);
    });
};


