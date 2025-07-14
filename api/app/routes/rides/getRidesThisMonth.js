const express = require("express");
const router = express.Router();
const countRidesThisMonth = require("../../controllers/rides/countRidesThisMonth");
const { jsonResponse } = require("../../librairies/response");

router.get("/prestations-ce-mois", async (req, res) => {
  try {
    const count = await countRidesThisMonth();
    return jsonResponse(res, 200, {}, { message: "Prestations réalisées ce mois", count });
  } catch (error) {
    return jsonResponse(res, 500, {}, { message: error.message });
  }
});
module.exports = router;
