// routes/documents/post.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const uploadDocument = require("../../controllers/documents/uploadDocument");
const { jsonResponse } = require("../../librairies/response");
const { isPostMethod } = require("../../librairies/method");

// 📂 Configuration Multer pour uploader dans /uploads/docs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/docs");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

router.post("/", upload.single("document"), async (req, res) => {
    if (!isPostMethod(req)) {
        return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponse(res, 401, {}, { message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const { type } = req.body;
    const filepath = path.join("uploads/docs", req.file.filename);

    try {
        const result = await uploadDocument(token, type, filepath);
        return jsonResponse(res, 201, {}, result);
    } catch (error) {
        return jsonResponse(res, 500, {}, { message: error.message });
    }
});

module.exports = router;
