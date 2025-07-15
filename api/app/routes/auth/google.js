const express = require("express");
const router = express.Router();
const googleAuth = require("../../controllers/auth/googleAuth");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
  if (!isPostMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return jsonResponse(res, 400, {}, { message: "Token Google manquant" });
    }

    // Authentifier avec Google
    const user = await googleAuth(token);

    // Durée du cookie (30 jours pour Google)
    const cookieMaxAge = 30 * 24 * 60 * 60 * 1000;

    // SET le cookie sécurisé
    res.cookie("auth_token", user.token, {
      httpOnly: true,
      secure: false, // Mettre à true en production avec HTTPS
      sameSite: "lax",
      maxAge: cookieMaxAge
    });

    // Retourner les données utilisateur AVEC le token pour le localStorage
    return jsonResponse(res, 200, {}, { 
      message: "Connexion Google réussie", 
      user 
    });
  } catch (error) {
    console.error("Erreur authentification Google:", error);
    return jsonResponse(res, 401, {}, { message: error.message });
  }
});

module.exports = router; 