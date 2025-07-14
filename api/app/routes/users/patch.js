const express = require("express");
const router = express.Router();
const updateUser = require("../../controllers/users/updateUser");
const updateUserPhoto = require("../../controllers/users/updateUserPhoto");
const deleteUserPhoto = require("../../controllers/users/deleteUserPhoto");
const upload = require("../../librairies/upload");
const { isPatchMethod } = require("../../librairies/method");
const deleteUser = require("../../controllers/users/deleteUser");
const db = require("../../models/users");

// Route pour mettre à jour les informations textuelles du profil
router.patch("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!isPatchMethod(req)) {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const result = await updateUser(token, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Route pour mettre à jour la photo de profil
router.patch("/me/photo", upload.single("photo"), async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const updatedUser = await updateUserPhoto(token, req.file);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour supprimer la photo de profil
router.delete("/me/photo", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const updatedUser = await deleteUserPhoto(token);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour supprimer le compte utilisateur
router.delete("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const result = await deleteUser(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/users/:id
router.patch("/:id", (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  // Appelle la méthode du modèle pour mettre à jour l'utilisateur
  db.updateUserById(userId, updates, (err, result) => {
    if (err){ 
       console.error("Erreur SQL PATCH user:", err);
       return res.status(500).json({ error: "Erreur serveur" });
      }
    res.json({ message: "Utilisateur mis à jour", updated: updates });
  });
});


module.exports = router;
