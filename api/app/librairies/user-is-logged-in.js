const jwt = require("jsonwebtoken");
require("dotenv").config();

function isUserLoggedIn(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded; // { userId, mail, iat, exp }
  } catch (error) {
    console.error("Token invalide :", error);
    throw new Error("Token invalide");
  }
}

module.exports = isUserLoggedIn;
