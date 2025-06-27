const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createShopOwner = require("../../controllers/shopOwner/createShopOwner");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

// ✅ Créer le dossier sécurisé s'il n'existe pas
const storagePath = path.join(__dirname, "../../storage/documents");
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
}

// ✅ Configurer multer pour stocker dans /storage/documents
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "_" + file.originalname.replace(/\s/g, "_");
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non autorisé (PDF, JPG, PNG uniquement)"), false);
    }
};

const upload = multer({ storage, fileFilter });

// ✅ Route POST sécurisée
router.post("/", upload.single("siret_file"), async (req, res) => {
    if (!isPostMethod(req)) return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return jsonResponse(res, 401, {}, { message: "Token manquant" });

    try {
        const result = await createShopOwner(token, req.body, req.file);
        return jsonResponse(res, 201, {}, result);
    } catch (err) {
        console.error("Erreur serveur lors de la création du commerçant:", err);
        return jsonResponse(res, 500, {}, { message: err.message || "Erreur interne" });
    }
});

module.exports = router;
