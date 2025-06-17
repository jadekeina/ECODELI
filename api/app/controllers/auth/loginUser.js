const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/users");

async function loginUser(mail, password) {
  return new Promise((resolve, reject) => {
    db.getUserByEmail(mail, async (err, result) => {
      if (err) return reject(new Error("Erreur serveur"));
      if (!result.length) return reject(new Error("Utilisateur non trouvé"));

      const user = result[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return reject(new Error("Mot de passe incorrect"));

      // 🔐 Création du token avec un timestamp pour le rendre unique
      const token = jwt.sign(
          {
            userId: user.id,
            mail: user.mail,
            timestamp: Date.now(), // ← ajoute une unicité
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
      );

      // 💾 Enregistrement du token dans la base de données
      db.setUserToken(user.id, token, (updateErr) => {
        if (updateErr) return reject(new Error("Erreur enregistrement du token"));

        // ✅ On enlève le mot de passe du retour
        delete user.password;

        // 🟢 On renvoie user + token
        resolve({
          token,
          user: {
            ...user,
            token,
          },
        });
      });
    });
  });
}

module.exports = loginUser;
