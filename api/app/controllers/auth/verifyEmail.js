const userModel = require("../../models/users");

async function verifyEmail(token) {
    return new Promise((resolve, reject) => {
        userModel.findByToken(token, (err, user) => {
            if (err || !user) return reject(new Error("Token invalide"));

            userModel.verifyUserEmail(user.id, (updateErr) => {
                if (updateErr) return reject(new Error("Erreur lors de l’activation"));
                resolve("Email vérifié avec succès");
            });
        });
    });
}

module.exports = verifyEmail;
