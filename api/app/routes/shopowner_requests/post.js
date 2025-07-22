const express = require("express");
const router = express.Router();
const createShopOwnerRequest = require("../../controllers/shopowner_requests/createShopOwnerRequest");
const upload = require("../../librairies/upload");
const auth = require("../../librairies/auth");
const multer = require("multer");
const tempUpload = multer({ dest: "app/storage/shop-owner-requests/tmp" });

router.post("/post", auth, tempUpload.single("photo"), createShopOwnerRequest);


module.exports = router;
