const express = require("express");
const router = express.Router();
const getMe = require("../../controllers/users/getMe");

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await getMe(token);
    res.status(200).json({ message: "Utilisateur connecté ✅", user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
