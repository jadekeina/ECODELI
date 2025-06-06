const express = require("express");
const router = express.Router();
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const db = require("../../models/users");

router.post("/", (req, res) => {
  const userId = req.body.userId;
  if (!isPostMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
  }

  db.clearUserToken(userId, (err) => {
    if (err) {
      return jsonResponse(res, 500, {}, { message: "Erreur lors de la déconnexion" });
    }
    return jsonResponse(res, 200, {}, { message: "Déconnexion réussie" });
  });
});

module.exports = router;
