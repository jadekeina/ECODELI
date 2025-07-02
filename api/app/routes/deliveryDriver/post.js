const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const createDeliveryDriver = require("../../controllers/deliveryDriver/createDeliveryDriver");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

// 🔒 Assure-toi que le dossier de stockage existe
const storagePath = path.join(__dirname, "../../storage/documents");
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
}

// 📂 Configuration de Multer
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
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non autorisé"), false);
    }
};

// ✅ Voici les noms attendus côté frontend
const upload = multer({ storage, fileFilter }).fields([
    { name: "permis", maxCount: 1 },
    { name: "piece_identite", maxCount: 1 },
    { name: "avis_sirene", maxCount: 1 },
    { name: "attestation_urssaf", maxCount: 1 },
    { name: "rc_pro", maxCount: 1 },
]);

router.post("/", (req, res) => {
    if (!isPostMethod(req)) return jsonResponse(res, 405, {}, { message: "Méthode non autorisée" });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return jsonResponse(res, 401, {}, { message: "Token manquant" });

    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return jsonResponse(res, 400, {}, { message: err.message });
        } else if (err) {
            return jsonResponse(res, 400, {}, { message: err.message });
        }

        try {
            const result = await createDeliveryDriver(token, req.body, req.files);
            return jsonResponse(res, 201, {}, result);
        } catch (err) {
            console.error("Erreur serveur lors de la création du livreur:", err);
            return jsonResponse(res, 500, {}, { message: err.message || "Erreur interne du serveur" });
        }
    });
});

module.exports = router;
