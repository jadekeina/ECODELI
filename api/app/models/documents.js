// models/documents.js
const db = require("../../config/db");

exports.insertDocument = (userId, type_document, chemin_fichier, callback) => {
    const sql = `INSERT INTO documents_justificatifs (user_id, type_document, chemin_fichier)
        VALUES (?, ?, ?)
    `;
    db.query(sql, [userId, type_document, chemin_fichier], callback);
};

exports.getDocumentsByUser = (userId, callback) => {
    const sql = `
        SELECT d.*, u.firstname, u.lastname 
        FROM documents_justificatifs d
        LEFT JOIN users u ON d.user_id = u.id
        WHERE d.user_id = ?
    `;
    db.query(sql, [userId], callback);
};

exports.getAllPendingDocuments = (callback) => {
    db.query("SELECT * FROM documents_justificatifs WHERE statut = 'en_attente'", callback);
};

exports.updateStatus = (docId, statut, callback) => {
    const sql = `UPDATE documents_justificatifs SET statut = ? WHERE id = ?`;
    db.query(sql, [statut, docId], callback);
};

exports.countDocsPending = (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM documents_justificatifs WHERE statut = 'en_attente'";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count);
    });
  };

exports.getAllPendingDocumentsWithUser = (callback) => {
    const sql = `
      SELECT d.id, d.type_document, d.chemin_fichier, d.statut, d.date_upload, u.firstname, u.lastname, u.id as user_id
      FROM documents_justificatifs d
      JOIN users u ON d.user_id = u.id
      WHERE d.statut = 'en_attente'
    `;
    db.query(sql, callback);
};


exports.rawQuery = (sql, values, callback) => {
    db.query(sql, values, callback);
};
