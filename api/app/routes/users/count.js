
const express = require("express");
const router = express.Router();
const countUsersLast24h = require("../../controllers/users/countUsersLast24h");
const countConnectionsLast24h = require("../../controllers/users/countConnectionsLast24h"); // AJOUT ICI
const { jsonResponse } = require("../../librairies/response");

// Nombre d'inscrits dans les 24h
router.get("/inscrits-24h", async (req, res) => {
  try {
    const count = await countUsersLast24h();
    return jsonResponse(res, 200, {}, { message: "Inscrits (24h)", count });
  } catch (error) {
    return jsonResponse(res, 500, {}, { message: error.message });
  }
});

// Nombre de connexions dans les 24h
router.get("/connexions-24h", async (req, res) => {
  console.log(">>> ROUTE /api/users/connexions-24h appelée !");
  try {
    const count = await countConnectionsLast24h();
    return jsonResponse(res, 200, {}, { message: "Connexions (24h)", count });
  } catch (error) {
    return jsonResponse(res, 500, {}, { message: error.message });
  }
});


module.exports = router;
