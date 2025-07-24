// app/controllers/shops/getShopById.js
const Shop = require("../../models/shop"); // Assurez-vous que ce chemin est correct vers votre modèle Shop
const { jsonResponse } = require("../../librairies/response"); // Assurez-vous que ce chemin est correct vers votre bibliothèque de réponses

const getShopById = async (req, res) => {
    try {
        const { id } = req.params; // L'ID de la boutique est extrait des paramètres de l'URL

        // Validation pour s'assurer que l'ID est un nombre valide
        if (!id || isNaN(id)) {
            return jsonResponse(res, 400, {}, { message: "ID de boutique invalide." });
        }

        const shopId = parseInt(id, 10); // Convertit l'ID en nombre entier

        // Appelle la méthode findById du modèle Shop pour récupérer la boutique
        const shop = await Shop.findById(shopId);

        if (!shop) {
            // Si aucune boutique n'est trouvée avec cet ID, renvoie une erreur 404 Not Found
            return jsonResponse(res, 404, {}, { message: "Boutique non trouvée." });
        }

        // Si la boutique est trouvée, renvoie les détails avec un statut 200 OK
        jsonResponse(res, 200, {}, { message: "Détails de la boutique récupérés avec succès.", shop: shop });

    } catch (error) {
        // En cas d'erreur inattendue, enregistre l'erreur et renvoie une erreur serveur (500)
        console.error("❌ Erreur dans getShopById:", error);
        jsonResponse(res, 500, {}, { message: "Erreur interne du serveur lors de la récupération de la boutique.", error: error.message });
    }
};

module.exports = getShopById;
