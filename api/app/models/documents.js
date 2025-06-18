// models/documents.js
const db = require("../../config/db");

exports.addDocument = (userId, type, chemin, callback) => {
    const sql = `INSERT INTO documents_justificatifs (user_id, type_document, chemin_fichier, statut)
               VALUES (?, ?, ?, 'en_attente')`;
    db.query(sql, [userId, type, chemin], callback);
};

exports.getDocumentsByUser = (userId, callback) => {
    const sql = `SELECT * FROM documents_justificatifs WHERE user_id = ?`;
    db.query(sql, [userId], callback);
};

exports.getAllPendingDocuments = (callback) => {
    db.query("SELECT * FROM documents_justificatifs WHERE statut = 'en_attente'", callback);
};

exports.updateStatus = (docId, statut, callback) => {
    const sql = `UPDATE documents_justificatifs SET statut = ? WHERE id = ?`;
    db.query(sql, [statut, docId], callback);
};
