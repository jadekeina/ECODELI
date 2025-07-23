const jwt = require("jsonwebtoken");
const userModel = require("../../models/users");
const providerModel = require("../../models/provider");
const deliveryDriverModel = require("../../models/deliveryDriver");
const shopOwnerModel = require("../../models/shopOwner");

async function getMe(token) {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;

      userModel.getUserById(userId, async (err, result) => {
        if (err || !result.length) return reject(new Error("Utilisateur introuvable"));

        const user = result[0];
        delete user.password;
        delete user.token;

        try {
          if (user.role === "provider") {
            const res = await new Promise((res, rej) =>
                providerModel.getProviderByUserId(userId, (e, r) => (e ? rej(e) : res(r)))
            );
            console.log("📦 Résultat providerModel :", res); // ← AJOUTE ÇA
            user.statut = res?.[0]?.statut_validation || null;

          } else if (user.role === "delivery-driver") {
            const res = await new Promise((res, rej) =>
                deliveryDriverModel.getDeliveryDriverByUserId(userId, (e, r) => (e ? rej(e) : res(r)))
            );
            user.statut = res?.[0]?.statut_validation || null;

          } else if (user.role === "shop-owner") {
            const res = await new Promise((res, rej) =>
                shopOwnerModel.getShopOwnerByUserId(userId, (e, r) => (e ? rej(e) : res(r)))
            );
            user.statut = res?.[0]?.statut_validation || null;
          }

          resolve(user);
        } catch (err) {
          console.error("Erreur en cherchant le statut pro :", err);
          resolve(user); // Renvoie quand même l'utilisateur, même si pas de statut trouvé
        }
      });
    } catch (err) {
      reject(new Error("Token invalide ou expiré"));
    }
  });
}

module.exports = getMe;