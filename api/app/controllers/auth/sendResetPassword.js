const crypto = require("crypto");
const userModel = require("../../models/users");
const sendMail = require("../../librairies/mailer");

async function sendResetPassword(mail) {
    return new Promise((resolve, reject) => {
        userModel.findByEmail(mail, async (err, user) => {
            if (err || !user) return reject(new Error("Utilisateur introuvable"));

            const token = crypto.randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + 3600000); // 1h

            userModel.setResetToken(user.id, token, expires, async (updateErr) => {
                if (updateErr) return reject(new Error("Erreur lors de l'enregistrement du token"));

                const link = `${process.env.FRONT_URL}/reset-password/${token}`;

                await sendMail({
                    to: user.mail,
                    subject: "Réinitialisation de votre mot de passe",
                    html: `
                    <p>Bonjour ${user.firstname},</p>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                    <p>Cliquez sur le lien ci-dessous pour le modifier :</p>
                    <a href="${link}">${link}</a>
                    <p>⚠️ Ce lien est valable pendant 1 heure.</p>
                  `
                });

                resolve("E-mail de réinitialisation envoyé");
            });
        });
    });
}

module.exports = sendResetPassword;
