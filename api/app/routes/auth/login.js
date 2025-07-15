const express = require("express");
const router = express.Router();
const loginUser = require("../../controllers/auth/loginUser");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
  if (!isPostMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
  }

  try {
    const { mail, password, rememberMe } = req.body;

    // Vérifie l'utilisateur et génère le token avec rememberMe
    const user = await loginUser(mail, password, rememberMe);

    // 🔐 Blocage si email non confirmé
    if (user.email_verified === 0) {
      return jsonResponse(res, 403, {}, {
        message: "Veuillez confirmer votre adresse email pour vous connecter"
      });
    }

    // Le token est déjà généré dans loginUser avec le bon format
    const token = user.token;

    // Durée selon "rememberMe"
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 30 jours ou 1h

    // SET le cookie sécurisé avec le même token
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // Mettre à true en production avec HTTPS
      sameSite: "lax",
      maxAge: cookieMaxAge
    });

    // Retourner les données utilisateur AVEC le token pour le localStorage
    return jsonResponse(res, 200, {}, { message: "Connexion réussie", user });
  } catch (error) {
    return jsonResponse(res, 401, {}, { message: error.message });
  }
});

module.exports = router;
