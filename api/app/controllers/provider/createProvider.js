// /storage/documents + multer.diskStorage

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const ProviderModel = require("../../models/provider");
const DocumentModel = require("../../models/documents");

async function createProvider(token, data, file) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const { type_prestation, zone_deplacement } = data;
    if (!type_prestation || !zone_deplacement) {
        throw new Error("Champs requis manquants.");
    }

    if (!file || !file.path) {
        throw new Error("Aucun fichier reçu.");
    }

    // 📍 chemin public enregistré en BDD (chemin relatif à partir de /storage)
    const cheminFichier = `/storage/documents/${file.filename}`;

    // ✅ Étape 1 : insérer dans provider
    await new Promise((resolve, reject) => {
        ProviderModel.insertProvider(userId, type_prestation, zone_deplacement, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    // ✅ Étape 2 : insérer dans documents_justificatifs
    await new Promise((resolve, reject) => {
        DocumentModel.insertDocument(userId, "diplome", cheminFichier, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    return { message: "Compte prestataire créé avec succès" };
}

module.exports = createProvider;
