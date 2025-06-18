// controllers/documents/uploadDocument.js
const jwt = require("jsonwebtoken");
const model = require("../../models/documents");

async function uploadDocument(token, type, filepath) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        return new Promise((resolve, reject) => {
            model.addDocument(userId, type, filepath, (err, result) => {
                if (err) return reject(err);
                resolve({ message: "Document uploaded", id: result.insertId });
            });
        });
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = uploadDocument;
