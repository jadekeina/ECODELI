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
    const result = await loginUser(req.body.mail, req.body.password);

    // 👉 À ce stade, `loginUser` a déjà tout géré (email non vérifié, envoi du mail, etc.)
    return jsonResponse(res, 200, {}, {
      message: "Connexion réussie",
      user: result
    });

  } catch (error) {
    return jsonResponse(res, 401, {}, { message: error.message });
  }
});

module.exports = router;
