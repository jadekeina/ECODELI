const db = require("../../models/users");
const jwt = require("jsonwebtoken");

async function updateUser(token, updates) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Construit dynamiquement la requête SQL
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) {
      throw new Error("Aucune donnée à mettre à jour");
    }

    values.push(userId); // Ajoute userId à la fin pour le WHERE

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.rawQuery(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve({ message: "Utilisateur mis à jour", updated: updates });
      });
    });
  } catch (err) {
    throw new Error("Token invalide ou expiré");
  }
}

module.exports = updateUser;
