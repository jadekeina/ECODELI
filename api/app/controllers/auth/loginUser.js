const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/users"); // Assurez-vous que ce 'db' est votre modèle 'users'
const sendMail = require("../../librairies/mailer");
const crypto = require("crypto");

async function loginUser(mail, password, rememberMe = false) {
  return new Promise((resolve, reject) => {
    db.getUserByEmail(mail, async (err, result) => {
      if (err) return reject(new Error("Erreur serveur"));
      if (!result.length) return reject(new Error("Utilisateur non trouvé"));

      const user = result[0];

      // Vérification du mot de passe
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return reject(new Error("Mot de passe incorrect"));

      // Vérification de l'email
      if (!user.email_verified) {
        const emailToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Assurez-vous que db.updateEmailToken utilise une Promise ou est promisifié
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

        return;
      }

      // Génération du token
      const tokenExpiry = rememberMe ? "30d" : "2h";
      const payload = {
        userId: user.id,
        mail: user.mail,
        role: user.role,
        status: user.status,
        timestamp: Date.now(),
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: tokenExpiry,
      });

      // Mise à jour du token en BDD
      // Assurez-vous que db.setUserToken utilise une Promise ou est promisifié
      db.setUserToken(user.id, token, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Erreur UPDATE token BDD :", updateErr);
          return reject(new Error("Erreur enregistrement du token"));
        }

        // --- DÉBUT DE LA MODIFICATION ---
        // Suppression de l'appel à db.logUserLogin
        // console.error("Erreur logUserLogin :", logErr); // Cette ligne est supprimée car logUserLogin est supprimé.
        // --- FIN DE LA MODIFICATION ---

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
