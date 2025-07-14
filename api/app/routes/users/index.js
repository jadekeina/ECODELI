const express = require("express");
const router = express.Router();

// Regroupe toutes les sous-routes users
router.use("/", require("./count")); 
router.use("/", require("./me"));
router.use("/", require("./last"));
router.use("/", require("./get"));
router.use("/", require("./post"));
router.use("/", require("./patch"));


module.exports = router;
