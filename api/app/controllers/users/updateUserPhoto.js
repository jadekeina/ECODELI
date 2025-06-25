const db = require("../../models/users");
const jwt = require("jsonwebtoken");

function updateUserPhoto(token, file) {
  return new Promise((resolve, reject) => {
    // 1. Vérifier le token et extraire l'ID utilisateur
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || !decoded.userId) {
      return reject(new Error("Token invalide ou expiré"));
    }
    const userId = decoded.userId;

    // 2. Vérifier que le fichier a bien été uploadé
    if (!file) {
      return reject(new Error("Aucun fichier fourni"));
    }

    // 3. Construire le chemin d'accès public à la photo
    // Le chemin est relatif à la racine du serveur, ex: /uploads/photo-167888.jpg
    const photoPath = `/uploads/${file.filename}`;

    // 4. Mettre à jour la base de données
    const sql = `UPDATE users SET profilpicture = ? WHERE id = ?`;
    db.rawQuery(sql, [photoPath, userId], (err, result) => {
      if (err) {
        return reject(err);
      }
      
      // 5. Renvoyer les informations utilisateur mises à jour
      db.getUserById(userId, (err, user) => {
        if (err) return reject(err);
        resolve(user[0]);
      });
    });
  });
}

module.exports = updateUserPhoto; 