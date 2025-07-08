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

    // 🔐 Blocage si email non confirmé
    if (result.email_verified === 0) {
      return jsonResponse(res, 403, {}, {
        message: "Veuillez confirmer votre adresse email pour vous connecter"
      });
    }

    return jsonResponse(res, 200, {}, {
      message: "Connexion réussie",
      user: result
    });
  } catch (error) {
    return jsonResponse(res, 401, {}, { message: error.message });
  }
});

module.exports = router;
