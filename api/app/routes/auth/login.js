const express = require("express");
const router = express.Router();
const loginUser = require("../../controllers/auth/loginUser");
const { isPostMethod } = require("../../librairies/method");
// const { jsonResponse } = require("../../librairies/response"); // <-- Commenter ou supprimer cette ligne

router.post("/", async (req, res) => {
  if (!isPostMethod(req)) {
    // Utiliser res.status().json() directement
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { mail, password, rememberMe } = req.body;

    const user = await loginUser(mail, password, rememberMe);

    if (user.email_verified === 0) {
      // Utiliser res.status().json() directement
      return res.status(403).json({
        message: "Veuillez confirmer votre adresse email pour vous connecter"
      });
    }

    const token = user.token;

    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // Mettre à true en production avec HTTPS
      sameSite: "lax",
      maxAge: cookieMaxAge
    });

    // --- DÉBUT DE LA MODIFICATION CRUCIALE ---
    // Renvoyer directement le token et l'objet user dans la réponse JSON
    return res.status(200).json({
      message: "Connexion réussie",
      token: token, // Le token est maintenant directement à la racine
      user: user    // L'objet user est aussi à la racine
    });
    // --- FIN DE LA MODIFICATION CRUCIALE ---

  } catch (error) {
    // Utiliser res.status().json() directement
    return res.status(401).json({ message: error.message });
  }
});

module.exports = router;
