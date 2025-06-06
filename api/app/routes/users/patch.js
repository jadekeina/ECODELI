const express = require("express");
const router = express.Router();
const updateUser = require("../../controllers/users/updateUser");
const { isPatchMethod } = require("../../librairies/method");

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

module.exports = router;
