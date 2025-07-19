const express = require("express");
const router = express.Router();

router.use("/", require("./get"));
router.use("/me", require("./me"));
router.use("/last", require("./last"));
router.use("/", require("./count"));
router.use("/", require("./last"));
router.use("/", require("./post"));
router.use("/", require("./patch"));

module.exports = router;
