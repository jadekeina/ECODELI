const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/users"); // Chemin correct

async function loginUser(mail, password) {
  return new Promise((resolve, reject) => {
    db.getUserByEmail(mail, async (err, result) => {
      if (err) return reject(new Error("Erreur serveur"));
      if (!result.length) return reject(new Error("Utilisateur non trouvé"));

      const user = result[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return reject(new Error("Mot de passe incorrect"));

      console.log("[Login] SECRET_KEY utilisée pour signer:", process.env.SECRET_KEY);

      const token = jwt.sign(
          {
            userId: user.id,
            mail: user.mail,
            role: user.role,
            status: user.status,
            timestamp: Date.now(),
          },
          process.env.SECRET_KEY,
          { expiresIn: "2h" }
      );

        console.log("🧪 setUserToken appelé");
        db.setUserToken(user.id, token, (updateErr, updateResult) => {
            if (updateErr) {
                console.error("❌ Erreur UPDATE token BDD :", updateErr);
                return reject(new Error("Erreur enregistrement du token"));
            }

            console.log("✅ Token mis à jour en BDD :", token);
            console.log("🗃️ Résultat de la mise à jour SQL :", updateResult);

            delete user.password;

            resolve({
                token,
                ...user,
            });
        });
    });
  });
}

module.exports = loginUser;