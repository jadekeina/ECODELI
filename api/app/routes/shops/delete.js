// app/controllers/shops/deleteShop.js
const Shop = require("../../models/shop"); // Chemin vers votre modèle Shop
const { jsonResponse } = require("../../librairies/response"); // Chemin vers votre bibliothèque de réponses

const deleteShop = async (req, res) => {
    try {
        const { id } = req.params; // L'ID de la boutique à supprimer

        // Validation de l'ID
        if (!id || isNaN(id)) {
            return jsonResponse(res, 400, {}, { message: "ID de boutique invalide." });
        }
        const shopId = parseInt(id, 10);

        // Optionnel: Vérifier que la boutique existe avant de tenter de la supprimer
        const existingShop = await Shop.findById(shopId);
        if (!existingShop) {
            return jsonResponse(res, 404, {}, { message: "Boutique non trouvée." });
        }

        // Optionnel: Vérifier les permissions (par exemple, seul le propriétaire peut supprimer sa boutique)
        // if (req.user.role === 'shop-owner' && existingShop.shop_owner_id !== req.user.shopOwnerId) {
        //     return jsonResponse(res, 403, {}, { message: "Accès interdit. Vous n'êtes pas le propriétaire de cette boutique." });
        // }

        const result = await Shop.delete(shopId);

        if (result.affectedRows === 0) {
            // Si affectedRows est 0, cela signifie que la boutique n'a pas été trouvée
            return jsonResponse(res, 404, {}, { message: "Boutique non trouvée ou déjà supprimée." });
        }

        jsonResponse(res, 200, {}, { message: "Boutique supprimée avec succès.", shopId: shopId });

    } catch (error) {
        console.error("❌ Erreur dans deleteShop:", error);
        jsonResponse(res, 500, {}, { message: "Erreur interne du serveur lors de la suppression de la boutique.", error: error.message });
    }
};

module.exports = deleteShop;
