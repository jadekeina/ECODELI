const db = require("../../models/users");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

function deleteUserPhoto(token) {
  return new Promise((resolve, reject) => {
    // 1. Authentifier l'utilisateur
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || !decoded.userId) {
      return reject(new Error("Token invalide ou expiré"));
    }
    const userId = decoded.userId;

    // 2. Récupérer l'utilisateur pour connaître le chemin de l'ancienne photo
    db.getUserById(userId, (err, users) => {
      if (err || users.length === 0) {
        return reject(new Error("Utilisateur non trouvé"));
      }
      const user = users[0];
      const oldPhotoPath = user.profilpicture;

      // 3. Mettre à jour la base de données avec la photo par défaut
      const defaultPhoto = "/uploads/default-avatar.png";
      const sql = `UPDATE users SET profilpicture = ? WHERE id = ?`;
      
      db.rawQuery(sql, [defaultPhoto, userId], (err, result) => {
        if (err) {
          return reject(err);
        }

        // 4. Supprimer l'ancien fichier photo du serveur (sauf si c'est la photo par défaut)
        if (oldPhotoPath && oldPhotoPath !== defaultPhoto) {
          const fullPath = path.join(__dirname, "../../../public", oldPhotoPath);
          fs.unlink(fullPath, (unlinkErr) => {
            if (unlinkErr) {
              // On ne bloque pas le processus si la suppression échoue, mais on le signale
              console.error("Erreur lors de la suppression de l'ancienne photo:", unlinkErr);
            }
          });
        }

        // 5. Renvoyer l'utilisateur mis à jour
        db.getUserById(userId, (err, updatedUsers) => {
          if (err) return reject(err);
          resolve(updatedUsers[0]);
        });
      });
    });
  });
}

module.exports = deleteUserPhoto; 