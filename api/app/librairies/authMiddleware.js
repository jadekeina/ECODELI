// api/librairies/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../models/users");


async function authMiddleware(req, res, next) {
  try {
    // Récupérer le token depuis le header Authorization OU depuis les cookies
    let token = null;
    
    // 1. Essayer de récupérer depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    
    // 2. Si pas de token dans le header, essayer depuis les cookies
    if (!token && req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      console.log("AUTH_MIDDLEWARE: Token manquant (ni header ni cookie)."); // DEBUG
      return res.status(401).json({ message: "Token manquant" });
    }

    console.log("AUTH_MIDDLEWARE: Token reçu (début):", token.substring(0, 20) + "..."); // DEBUG

    if (!process.env.SECRET_KEY) {
      console.error("AUTH_MIDDLEWARE: SECRET_KEY non définie!"); // DEBUG
      return res.status(500).json({ message: "Erreur de configuration serveur: SECRET_KEY manquante." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("AUTH_MIDDLEWARE: Token décodé. Payload:", decoded); // DEBUG: TRÈS IMPORTANT
    } catch (jwtError) {
      console.error("AUTH_MIDDLEWARE: Erreur lors de la vérification JWT:", jwtError.name, jwtError.message); // DEBUG
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Authentification échouée: Token expiré." });
      }
      return res.status(401).json({ message: "Authentification échouée: Token invalide." });
    }

    // Extraire l'ID utilisateur selon le format du token
    const userId = decoded.userId || decoded.id;
    console.log("AUTH_MIDDLEWARE: userId extrait du token:", userId); // DEBUG

    // --- VÉRIFICATION CRUCIALE : `db.getUserById` ---
    db.getUserById(userId, (err, result) => {
      if (err) {
        console.error("AUTH_MIDDLEWARE: Erreur BDD dans getUserById:", err); // DEBUG
        return res.status(500).json({ message: "Erreur serveur lors de la récupération de l'utilisateur." });
      }
      if (!result || !result.length) {
        console.log("AUTH_MIDDLEWARE: db.getUserById N'A PAS TROUVÉ l'utilisateur avec ID:", userId); // DEBUG: C'EST VOTRE MESSAGE ACTUEL
        return res.status(401).json({ message: "Authentification échouée: Utilisateur introuvable." });
      }

      const user = result[0];
      console.log("AUTH_MIDDLEWARE: Utilisateur trouvé en BDD:", user.mail, "Token BDD (début):", user.token ? user.token.substring(0,20) + '...' : 'N/A'); // DEBUG

      // Vérifier si le token correspond à celui en base (optionnel)
      if (user.token && user.token !== token) {
        console.log("AUTH_MIDDLEWARE: Mismatch Token BDD vs Token fourni."); // DEBUG
        // On peut être permissif car le token JWT est valide
        console.log("AUTH_MIDDLEWARE: Token JWT valide, on autorise malgré le mismatch");
      }

      delete user.password;
      req.user = user;
      console.log("=== MIDDLEWARE OK, utilisateur trouvé ===", user.mail);
      next();
    });
  } catch (error) {
    console.error("AUTH_MIDDLEWARE: Erreur inattendue dans le middleware:", error); // DEBUG
    return res.status(500).json({ message: "Erreur interne du serveur lors de l'authentification." });
  }
}

module.exports = authMiddleware;