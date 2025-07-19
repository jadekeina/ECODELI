const jwt = require("jsonwebtoken");
const model = require("../../models/documents");

module.exports = async function uploadDocument(token, type, filepath) {
    // 1. Vérification et décodage du token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        throw new Error("Token invalide ou expiré");
    }
    const userId = decoded.userId || decoded.id;
    if (!userId) throw new Error("Utilisateur non trouvé");

    // 2. Vérification du type de document
    const validTypes = [
        'permis', 'piece_identite', 'avis_sirene',
        'attestation_urssaf', 'rc_pro', 'diplome',
        'siret', 'attestation_autoentrepreneur'
    ];
    if (!validTypes.includes(type)) {
        throw new Error("Type de document invalide");
    }

    // 3. Insertion du document en BDD
    return new Promise((resolve, reject) => {
        model.insertDocument(userId, type, filepath, (err, result) => {
            if (err) return reject(new Error("Erreur lors de la sauvegarde du document"));
            resolve({
                message: "Document uploadé avec succès",
                documentId: result.insertId
            });
        });
    });
};