const bcrypt = require("bcrypt");
const userModel = require("../../models/users");

async function resetPassword(token, newPassword) {
    return new Promise((resolve, reject) => {
        userModel.findByResetToken(token, async (err, user) => {
            if (err || !user || new Date() > new Date(user.reset_token_expires)) {
                return reject(new Error("Lien invalide ou expiré"));
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            userModel.updatePassword(user.id, hashed, (updateErr) => {
                if (updateErr) return reject(new Error("Erreur lors de la mise à jour"));
                resolve("Mot de passe réinitialisé avec succès");
            });
        });
    });
}

module.exports = resetPassword;
