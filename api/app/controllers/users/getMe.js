const userModel = require("../../models/users");
const jwt = require("jsonwebtoken");

async function getMe(token) {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;

      userModel.getUserById(userId, (err, result) => {
        if (err) return reject(new Error("Erreur lors de la récupération"));
        if (!result || !result.length) return reject(new Error("Utilisateur introuvable"));

        const user = result[0];
        delete user.password;
        delete user.token;
        resolve(user);
      });
    } catch (error) {
      reject(new Error("Token invalide ou expiré"));
    }
  });
}

module.exports = getMe;
