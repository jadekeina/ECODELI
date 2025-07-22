const ShopOwnerRequest = require("../../models/shopownerRequest");
const { jsonResponse } = require("../../librairies/response");

module.exports = async (req, res) => {
    try {
        if (req.user.role !== "delivery-driver") {
            return jsonResponse(res, 403, {}, { message: "Accès réservé aux livreurs." });
        }

        const requests = await ShopOwnerRequest.findAllForDeliveryDrivers();
        jsonResponse(res, 200, {}, requests);
    } catch (err) {
        console.error("❌ [getAllShopOwnerRequests] Erreur :", err);
        jsonResponse(res, 500, {}, { message: "Erreur serveur", error: err.message });
    }
};
