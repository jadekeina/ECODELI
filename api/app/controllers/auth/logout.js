const db = require("../../models/users");

async function logoutUser(userId) {
  return new Promise((resolve, reject) => {
    db.clearUserToken(userId, (err) => {
      if (err) return reject(new Error("Erreur lors de la déconnexion"));
      resolve();
    });
  });
}

module.exports = logoutUser;
