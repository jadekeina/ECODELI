const express = require("express");
const router = express.Router();

const getServiceRequestsByProvider = require("../../controllers/service_requests/getServiceRequestsByProvider");
const auth = require("../../librairies/authMiddleware");
const { isGetMethod } = require("../../librairies/method");
const response = require("../../librairies/response");

router.get("/provider/:id", auth, async (req, res) => {
    if (!isGetMethod(req)) return response.methodNotAllowed(res);
    try {
        await getServiceRequestsByProvider(req, res);
    } catch (err) {
        response.internalServerError(res, err);
    }
});

module.exports = router;
