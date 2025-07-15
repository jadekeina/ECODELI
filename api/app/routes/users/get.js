const express = require("express");
const router = express.Router();
const getUsers = require("../../controllers/users/getUsers");
const db = require("../../models/users");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");
const auth = require('../../librairies/authMiddleware');

// Route /me - DOIT être AVANT /:id
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

// Tous les utilisateurs
router.get("/", async (req, res) => {
  if (!isGetMethod(req)) return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });

  try {
    const data = await getUsers();
    return jsonResponse(res, 200, {}, { users: data });
  } catch (error) {
    return jsonResponse(res, 500, {}, { message: error.message });
  }
});

// Utilisateur par ID
router.get("/:id", async (req, res) => {
  if (!isGetMethod(req)) return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });

  try {
    const data = await getUsers(req.params.id);
    return jsonResponse(res, 200, {}, { message: "User retrieved", data });
  } catch (error) {
    return jsonResponse(res, 404, {}, { message: error.message });
  }
});

router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  db.deleteUserById(userId, (err, result) => {
    if (err) {
      console.error("Erreur suppression utilisateur:", err);
      return res.status(500).json({ error: "Erreur suppression" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé" });
  });
});


module.exports = router;
