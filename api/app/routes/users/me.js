const express = require("express");
const router = express.Router();
const getMe = require("../../controllers/users/getMe");
const { jsonResponse } = require("../../librairies/response");
const { isGetMethod } = require("../../librairies/method");
const auth = require('../../librairies/authMiddleware');

// Route qui utilise le middleware d'authentification (peut lire cookies ET headers)
router.get("/me", auth, async (req, res) => {
  if (!isGetMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
  }

  try {
    // req.user est déjà disponible grâce au middleware d'authentification
    return jsonResponse(res, 200, {}, { message: "Utilisateur connecté ✅", data: req.user });
  } catch (error) {
    return jsonResponse(res, 404, {}, { message: error.message });
  }
});

// Route alternative qui utilise le middleware d'authentification
router.get('/', auth, (req, res) => {
  // req.user contient les infos décodées du JWT
  res.json({ user: req.user });
});

module.exports = router;
