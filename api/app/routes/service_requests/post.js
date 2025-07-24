const express = require("express");
const router = express.Router();

const createServiceRequest = require("../../controllers/service_requests/createServiceRequest");
const auth = require("../../librairies/authMiddleware");
const { isPostMethod } = require("../../librairies/method");
const response = require("../../librairies/response");

router.post("/", auth, async (req, res) => {
    if (!isPostMethod(req)) return response.methodNotAllowed(res);
    try {
        await createServiceRequest(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

module.exports = router;
