const express = require("express");
const router = express.Router();
const getMe = require("../../controllers/users/getMe");
const { jsonResponse } = require("../../librairies/response");
const { isGetMethod } = require("../../librairies/method");

router.get("/me", async (req, res) => {
  if (!isGetMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return jsonResponse(res, 401, {}, { message: "Token manquant" });
  }

  try {
    const data = await getMe(token);
    return jsonResponse(res, 200, {}, { message: "Utilisateur connecté ✅", data });
  } catch (error) {
    return jsonResponse(res, 404, {}, { message: error.message });
  }
});

module.exports = router;
