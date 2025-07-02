const jwt = require("jsonwebtoken");
const DeliveryModel = require("../../models/deliveryDriver");
const DocumentModel = require("../../models/documents");

async function createDeliveryDriver(token, data, files) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const { zone_deplacement } = data;
    if (!zone_deplacement) throw new Error("Zone de déplacement manquante");

    // Étape 1 : Enregistrement du profil
    await new Promise((resolve, reject) => {
        DeliveryModel.createDeliveryDriver(userId, zone_deplacement, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    // Étape 2 : Upload des documents
    const documents = [
        "permis",
        "piece_identite",
        "avis_sirene",
        "attestation_urssaf",
        "rc_pro",
    ];

    for (const docType of documents) {
        const fileArray = files[docType];
        if (fileArray && fileArray.length > 0) {
            const chemin_fichier = fileArray[0].path;
            await new Promise((resolve, reject) => {
                DocumentModel.insertDocument(userId, docType, chemin_fichier, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    }

    return { message: "Compte chauffeur créé avec succès" };
}

module.exports = createDeliveryDriver;
