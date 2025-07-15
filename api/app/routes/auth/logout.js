const express = require("express");
const router = express.Router();
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const db = require("../../models/users");
const auth = require("../../librairies/authMiddleware");

router.post("/", auth, (req, res) => {
  if (!isPostMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
  }

  const userId = req.user.id; // Récupérer l'ID depuis le middleware d'authentification

  // Supprimer le token de la base de données
  db.clearUserToken(userId, (err) => {
    if (err) {
      console.error("Erreur lors de la suppression du token en BDD:", err);
      return jsonResponse(res, 500, {}, { message: "Erreur lors de la déconnexion" });
    }

    // Supprimer le cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return jsonResponse(res, 200, {}, { message: "Déconnexion réussie" });
  });
});

module.exports = router;
