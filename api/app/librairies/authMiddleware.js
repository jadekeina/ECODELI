const jwt = require("jsonwebtoken");
const db = require("../models/users");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou mal formé" });
    }

    const token = authHeader.split(" ")[1];

    // Vérifie si le token est bien signé
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Vérifie si le token est présent en base pour l'utilisateur
    db.getUserById(decoded.userId, (err, result) => {
      if (err || !result.length) {
        return res.status(401).json({ message: "Utilisateur invalide" });
      }

      const user = result[0];

      if (user.token !== token) {
        return res.status(401).json({ message: "Token expiré ou déconnecté" });
      }

      req.user = user; // On ajoute l'utilisateur dans la requête
      next(); // Autorisé à accéder à la route
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentification échouée", error: error.message });
  }
}

module.exports = authMiddleware;
