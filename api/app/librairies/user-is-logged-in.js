const jwt = require("jsonwebtoken");

// Cette fonction doit être un middleware Express (req, res, next)
function isUserLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;

  // --- NOUVEAUX LOGS DE DÉBOGAGE ---
  console.log("--- Début isUserLoggedIn Middleware ---");
  console.log("isUserLoggedIn: req.headers.authorization:", authHeader ? authHeader.substring(0, 50) + '...' : 'null');
  // --- FIN NOUVEAUX LOGS ---

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("isUserLoggedIn: Token manquant ou mal formé dans le header.");
    return res.status(401).json({ message: "Accès non autorisé: Token manquant ou mal formé" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.SECRET_KEY) {
    console.error("isUserLoggedIn: SECRET_KEY non définie!");
    return res.status(500).json({ message: "Erreur de configuration serveur: SECRET_KEY manquante." });
  }

  // --- NOUVEAUX LOGS DE DÉBOGAGE ---
  console.log("isUserLoggedIn: Token extrait:", token.substring(0, 50) + '...');
  // ATTENTION: NE JAMAIS LOGGUER LA CLÉ SECRÈTE EN ENTIER EN PRODUCTION !
  // Pour le débogage, nous allons logger une partie pour vérifier la cohérence.
  console.log("isUserLoggedIn: SECRET_KEY (début):", process.env.SECRET_KEY.substring(0, 10) + '...');
  // --- FIN NOUVEAUX LOGS ---

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attacher les infos décodées à req.user
    console.log("isUserLoggedIn: Token vérifié avec succès. Payload:", decoded);
    console.log("--- Fin isUserLoggedIn Middleware ---");
    next(); // Passer au middleware/route suivant
  } catch (err) {
    console.error("❌ isUserLoggedIn: Erreur lors de la vérification JWT:", err.name, err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Authentification échouée: Token expiré." });
    }
    return res.status(401).json({ message: "Authentification échouée: Token invalide." });
  }
}

module.exports = isUserLoggedIn;
