const crypto = require("crypto");
const userModel = require("../../models/users");
const sendMail = require("../../librairies/mailer");

async function sendResetPassword(email) {
    return new Promise((resolve, reject) => {
        userModel.findByEmail(email, async (err, user) => {
            if (err || !user) return reject(new Error("Utilisateur introuvable"));

            const token = crypto.randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + 3600000); // 1h

            userModel.setResetToken(user.id, token, expires, async (updateErr) => {
                if (updateErr) return reject(new Error("Erreur interne"));

                const link = `${process.env.BASE_URL}/reset-password/${token}`;
                await sendMail({
                    to: email,
                    subject: "Réinitialisez votre mot de passe",
                    html: `<p>Voici votre lien pour réinitialiser votre mot de passe :</p><a href="${link}">${link}</a>`
                });

                resolve("E-mail de réinitialisation envoyé");
            });
        });
    });
}

module.exports = sendResetPassword;
