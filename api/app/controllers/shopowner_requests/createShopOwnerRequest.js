const ShopOwnerRequest = require("../../models/shopownerRequest");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res) => {
    console.log("[createShopOwnerRequest] Début du contrôleur.");
    console.log("[createShopOwnerRequest] req.user:", req.user);
    console.log("[createShopOwnerRequest] req.body:", req.body);

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentification requise." });
        }

        if (req.user.role !== "shop-owner") {
            return res.status(403).json({ message: "Accès refusé. Rôle 'shop-owner' requis." });
        }

        const {
            type, title, description, poids, longueur,
            largeur, hauteur, adresse, date, heure,
            prix, destinataire_nom, destinataire_prenom, shop_id
        } = req.body;

        if (!type || !title || !adresse || !date || !heure || !prix || !destinataire_nom || !destinataire_prenom || !shop_id) {
            return res.status(400).json({ message: "Tous les champs requis ne sont pas fournis." });
        }

        // Gestion de l’image
        const uploadDir = path.join(__dirname, "../../storage/shop-owner-requests");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        let photoPath = "/storage/default-images/none-white.png"; // valeur par défaut

        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const fileName = `photo-${Date.now()}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, fs.readFileSync(req.file.path)); // copie temporaire
            photoPath = `/storage/shop-owner-requests/${fileName}`;
            fs.unlinkSync(req.file.path); //suppression du fichier tmp
        }


        const requestData = {
            user_id: req.user.id,
            type,
            title,
            description,
            poids,
            longueur,
            largeur,
            hauteur,
            photo: photoPath,
            adresse_livraison: adresse,
            date_livraison: date,
            heure_livraison: heure,
            prix,
            destinataire_nom,
            destinataire_prenom,
            shop_id
        };

        const id = await ShopOwnerRequest.create(requestData);
        res.status(201).json({ message: "Demande créée avec succès", id });
    } catch (err) {
        console.error("❌ [createShopOwnerRequest] Erreur :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
