const express = require("express");
const router = express.Router();

router.use("/", require("./get"));
router.use("/me", require("./me"));
console.log("me /me appelé");
router.use("/last", require("./last"));
router.use("/", require("./count"));
router.use("/", require("./last"));
router.use("/", require("./post"));
router.use("/", require("./patch"));
console.log("PATCH /me appelé");

module.exports = router;
