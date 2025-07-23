const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/users");
const sendMail = require("../../librairies/mailer");
const crypto = require("crypto");

async function loginUser(mail, password, rememberMe = false) {
  return new Promise((resolve, reject) => {
    db.getUserByEmail(mail, async (err, result) => {
      if (err) return reject(new Error("Erreur serveur"));
      if (!result.length) return reject(new Error("Utilisateur non trouvé"));

      const user = result[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return reject(new Error("Mot de passe incorrect"));

      // 🚨 Vérification de l'adresse email
      if (!user.email_verified) {
        const emailToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Mise à jour du token dans la BDD
        db.updateEmailToken(user.id, emailToken, expiresAt, async (updateErr) => {
          if (updateErr) {
            console.error("Erreur updateEmailToken:", updateErr);
            return reject(new Error("Erreur lors de la génération du lien de vérification"));
          }

          const confirmLink = `${process.env.FRONT_URL}/email-confirmed/${emailToken}`;

          await sendMail({
            to: user.mail,
            subject: "Confirmez votre adresse email",
            html: `<p>Merci pour votre inscription sur EcoDeli.</p>
                   <p>Pour activer votre compte, cliquez ici :</p>
                   <a href="${confirmLink}">${confirmLink}</a>`
          });

          return reject(new Error("Veuillez confirmer votre adresse email pour vous connecter"));
        });

        return; // Important pour ne pas continuer le flux
      }

      const tokenExpiry = rememberMe ? "30d" : "2h";

      // ✅ Génération du token
      const token = jwt.sign(
          {
            userId: user.id,
            mail: user.mail,
            role: user.role,
            status: user.status,
            timestamp: Date.now(),
          },
          process.env.SECRET_KEY,
          { expiresIn: tokenExpiry }
      );

      db.setUserToken(user.id, token, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("❌ Erreur UPDATE token BDD :", updateErr);
          return reject(new Error("Erreur enregistrement du token"));
        }

        // Log the login in user_logins
        db.logUserLogin(user.id, (logErr) => {
          if (logErr) {
            console.error("❌ Erreur logUserLogin :", logErr);
            // On ne bloque pas la connexion si le log échoue
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
  });
}

module.exports = loginUser;