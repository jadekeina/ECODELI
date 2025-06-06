const jwt = require("jsonwebtoken");
const db = require("../../models/users");

async function getMe(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return new Promise((resolve, reject) => {
      db.getUserById(decoded.userId, (err, result) => {
        if (err || !result.length) {
          return reject(new Error("User not found"));
        }
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
