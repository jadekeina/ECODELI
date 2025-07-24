// app/controllers/shops/updateShop.js
const Shop = require("../../models/shop"); // Chemin vers votre modèle Shop
const { jsonResponse } = require("../../librairies/response"); // Chemin vers votre bibliothèque de réponses

const updateShop = async (req, res) => {
    try {
        const { id } = req.params; // L'ID de la boutique à modifier
        const updateData = req.body; // Les données de mise à jour envoyées dans le corps de la requête

        // Validation de l'ID
        if (!id || isNaN(id)) {
            return jsonResponse(res, 400, {}, { message: "ID de boutique invalide." });
        }
        const shopId = parseInt(id, 10);

        // Validation des données de mise à jour (exemple simple)
        if (Object.keys(updateData).length === 0) {
            return jsonResponse(res, 400, {}, { message: "Aucune donnée fournie pour la mise à jour." });
        }

        // Optionnel: Vérifier que la boutique existe avant de tenter de la modifier
        const existingShop = await Shop.findById(shopId);
        if (!existingShop) {
            return jsonResponse(res, 404, {}, { message: "Boutique non trouvée." });
        }

        // Optionnel: Vérifier les permissions (par exemple, seul le propriétaire peut modifier sa boutique)
        // if (req.user.role === 'shop-owner' && existingShop.shop_owner_id !== req.user.shopOwnerId) {
        //     return jsonResponse(res, 403, {}, { message: "Accès interdit. Vous n'êtes pas le propriétaire de cette boutique." });
        // }


        const result = await Shop.update(shopId, updateData);

        if (result.affectedRows === 0) {
            // Si affectedRows est 0, cela signifie que la boutique n'a pas été trouvée ou qu'aucune donnée n'a changé
            return jsonResponse(res, 404, {}, { message: "Boutique non trouvée ou aucune modification appliquée." });
        }

        jsonResponse(res, 200, {}, { message: "Boutique mise à jour avec succès.", shopId: shopId });

    } catch (error) {
        console.error("❌ Erreur dans updateShop:", error);
        jsonResponse(res, 500, {}, { message: "Erreur interne du serveur lors de la mise à jour de la boutique.", error: error.message });
    }
};

module.exports = updateShop;
