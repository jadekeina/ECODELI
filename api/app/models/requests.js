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

