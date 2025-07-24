const express = require("express");
const router  = express.Router();
const auth    = require("../../librairies/authMiddleware");
const ctrl    = require("../../controllers/payments");

// Toutes les routes nécessitent un token
router.use(auth);

router.get("/me",            ctrl.getAll);
router.post("/cards",        ctrl.addCard);            // Stripe
router.delete("/cards/:id",  ctrl.deleteCard);
router.patch("/cards/:id/default", ctrl.setDefaultCard);
router.patch("/iban",        ctrl.setIban);
router.use("/service", require("./service"));


module.exports = router;
