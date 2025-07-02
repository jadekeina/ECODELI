// controllers/documents/validateDocument.js
const model = require("../../models/documents");

function validateDocument(documentId, statut) {
    if (!documentId || !["valide", "refuse", "en_attente"].includes(statut)) {
        throw new Error("Invalid parameters");
    }

    return new Promise((resolve, reject) => {
        model.updateStatus(documentId, statut, (err, result) => {
            if (err) return reject(err);
            resolve({ message: `Document updated to '${statut}'` });
        });
    });
}

module.exports = validateDocument;
