// api/app/controllers/shops/createShop.js
const db = require("../../../config/db").promise();

module.exports = async (req, res) => {
    try {
        console.log("🔍 [createShop] req.user :", req.user);
        console.log("🔍 [createShop] req.user.id :", req.user ? req.user.id : "undefined");
        console.log("🔍 [createShop] req.body :", req.body);

        const userId = req.user.id; // L'ID de l'utilisateur connecté (14)

        if (!userId) {
            console.error("❌ [createShop] ID utilisateur manquant ou invalide.");
            return res.status(400).json({ message: "ID utilisateur manquant ou invalide. Veuillez vous assurer d'être connecté." });
        }

        // ÉTAPE CRUCIALE : Récupérer le shop_owner_id correspondant à l'userId
        const [shopOwnerRows] = await db.query(
            `SELECT id FROM shop_owner WHERE user_id = ?`,
            [userId]
        );

        if (shopOwnerRows.length === 0) {
            console.error("❌ [createShop] Aucun profil shop_owner trouvé pour l'utilisateur ID:", userId);
            return res.status(404).json({ message: "Aucun profil de propriétaire de boutique trouvé pour cet utilisateur." });
        }

        const shop_owner_id = shopOwnerRows[0].id; // C'est l'ID du profil shop_owner (qui est 3 dans votre cas)
        console.log("✅ [createShop] shop_owner_id récupéré :", shop_owner_id);

        const { name, address } = req.body;

        if (!name || !address) {
            return res.status(400).json({ message: "Le nom et l'adresse de la boutique sont requis." });
        }

        // Insérer la nouvelle boutique dans la base de données avec le shop_owner_id CORRECT
        const [result] = await db.query(
            `INSERT INTO shops (shop_owner_id, name, address) VALUES (?, ?, ?)`,
            [shop_owner_id, name, address]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "Erreur lors de la création de la boutique." });
        }

        res.status(201).json({
            message: "Boutique créée avec succès.",
            shopId: result.insertId
        });

    } catch (error) {
        console.error("[createShop] Erreur :", error);
        res.status(500).json({ message: "Erreur serveur lors de la création de la boutique.", error: error.message });
    }
};
