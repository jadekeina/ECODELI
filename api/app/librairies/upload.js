const multer = require("multer");
const path = require("path");

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Les images seront sauvegardées dans le dossier 'public/uploads'
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    // Génère un nom de fichier unique pour éviter les conflits
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées !"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limite la taille à 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload; 