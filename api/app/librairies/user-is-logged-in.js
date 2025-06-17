const jwt = require("jsonwebtoken");

function isUserLoggedIn(token) {
  if (!token) throw new Error("Token manquant");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded; // doit contenir au minimum `userId`
  } catch (err) {
    throw new Error("Token invalide");
  }
}

module.exports = isUserLoggedIn;
