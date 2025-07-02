const db = require("../../models/users");
const jwt = require("jsonwebtoken");

function deleteUser(token) {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;
      if (!userId) return reject(new Error("userId manquant dans le token"));
      db.deleteUserById(userId, (err, result) => {
        if (err) return reject(err);
        resolve({ message: "Compte supprimé" });
      });
    } catch (err) {
      reject(new Error("Token invalide ou expiré"));
    }
  });
}

module.exports = deleteUser; 