const express = require("express");
const router = express.Router();
const getUsers = require("../../controllers/users/getUsers");
const { isGetMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

// Tous les utilisateurs
router.get("/", async (req, res) => {
  if (!isGetMethod(req)) return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });

  try {
    const data = await getUsers();
    return jsonResponse(res, 200, {}, { message: "Users retrieved", data });
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

module.exports = router;
