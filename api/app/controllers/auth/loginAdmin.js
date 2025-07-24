const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/users");

async function loginAdmin(mail, password) {
    return new Promise((resolve, reject) => {
        console.log("🔍 Tentative de connexion admin avec:", mail);

        db.getUserByEmail(mail, async (err, result) => {
            if (err) {
                console.error("❌ Erreur DB:", err);
                return reject(new Error("Erreur serveur"));
            }

            if (!result.length) {
                console.log("❌ Aucun utilisateur trouvé pour:", mail);
                return reject(new Error("Utilisateur non trouvé"));
            }

            const user = result[0];
            console.log("✅ Utilisateur trouvé:", {
                id: user.id,
                mail: user.mail,
                role: user.role,
                hasPassword: !!user.password,
                passwordLength: user.password ? user.password.length : 0
            });

            if (user.role !== "admin") {
                console.log("❌ Rôle incorrect:", user.role);
                return reject(new Error("Accès réservé à l'admin"));
            }

            console.log("🔐 Comparaison des mots de passe...");
            console.log("Password reçu:", password);
            console.log("Hash en DB:", user.password);

            try {
                const isValid = await bcrypt.compare(password, user.password);
                console.log("✅ Résultat bcrypt.compare:", isValid);

                if (!isValid) {
                    console.log("❌ Mot de passe incorrect");
                    return reject(new Error("Mot de passe incorrect"));
                }

                console.log("✅ Mot de passe valide, génération du token...");

                const token = jwt.sign(
                    {
                        userId: user.id,
                        mail: user.mail,
                        role: user.role,
                        timestamp: Date.now(),
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: "2h" }
                );

                console.log("✅ Token généré");

                db.setUserToken(user.id, token, (updateErr) => {
                    if (updateErr) {
                        console.error("❌ Erreur UPDATE token:", updateErr);
                        return reject(new Error("Erreur enregistrement du token"));
                    }

                    console.log("✅ Token enregistré en DB");
                    delete user.password;
                    resolve({
                        token,
                        ...user,
                    });
                });
            } catch (bcryptError) {
                console.error("❌ Erreur bcrypt:", bcryptError);
                return reject(new Error("Erreur de vérification du mot de passe"));
            }
        });
    });
}

module.exports = loginAdmin;