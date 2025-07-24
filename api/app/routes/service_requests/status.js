const express = require("express");
const router = express.Router();
const auth = require("../../librairies/authMiddleware");
const updateRequestStatus = require("../../controllers/service_requests/updateRequestStatus");

router.patch("/:id/status", auth, updateRequestStatus);

module.exports = router;
