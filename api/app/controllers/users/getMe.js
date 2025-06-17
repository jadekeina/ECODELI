const db = require("../../models/users");
const isUserLoggedIn = require("../../librairies/user-is-logged-in");

async function getMe(token) {
  try {
    const decoded = isUserLoggedIn(token); // récupère userId depuis le token
    const userId = decoded.userId;

    return new Promise((resolve, reject) => {
      db.getUserById(userId, (err, result) => {
        if (err) return reject(new Error("Erreur lors de la récupération"));
        if (!result || !result.length) return reject(new Error("User not found"));

        const user = result[0];
        delete user.password;
        resolve(user);
      });
    });
  } catch (err) {
    throw new Error("Token invalide");
  }
}

module.exports = getMe;
