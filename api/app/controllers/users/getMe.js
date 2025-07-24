const jwt = require("jsonwebtoken");
const userModel = require("../../models/users");
const providerModel = require("../../models/provider");
const deliveryDriverModel = require("../../models/deliveryDriver");
const shopOwnerModel = require("../../models/shopOwner"); // Assurez-vous que ce modèle est correctement importé

async function getMe(token) {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;

      console.log("--- BACKEND DEBUG: getMe START ---");
      console.log("1. Decoded userId from token:", userId);

      userModel.getUserById(userId, async (err, result) => {
        if (err || !result.length) {
          console.error("❌ BACKEND DEBUG: userModel.getUserById error or no result:", err);
          return reject(new Error("Utilisateur introuvable"));
        }

        const user = result[0];
        delete user.password;
        delete user.token; // Supprime le token du JWT, pas le token d'authentification

        console.log("2. User fetched from DB (initial):", user);

        try {
          if (user.role === "provider") {
            const res = await new Promise((res, rej) =>
                providerModel.getProviderByUserId(userId, (e, r) => (e ? rej(e) : res(r)))
            );
            console.log("3.1. Provider model result:", res);
            user.statut = res?.[0]?.statut_validation || null;

          } else if (user.role === "delivery-driver") {
            const res = await new Promise((res, rej) =>
                deliveryDriverModel.getDeliveryDriverByUserId(userId, (e, r) => (e ? rej(e) : res(r)))
            );
            console.log("3.2. Delivery Driver model result:", res);
            user.statut = res?.[0]?.statut_validation || null;

          } else if (user.role === "shop-owner") {
            console.log("3.3. User role is shop-owner. Fetching shop owner details...");
            const shopOwnerRes = await new Promise((res, rej) =>
                shopOwnerModel.getShopOwnerByUserId(userId, (e, r) => (e ? rej(e) : res(r)))
            );

            console.log("🔍 BACKEND DEBUG: shopOwnerModel.getShopOwnerByUserId result:", shopOwnerRes);

            user.statut = shopOwnerRes?.[0]?.statut_validation || null;

            // --- LA LIGNE CRUCIALE : Assigner le shop_owner_id ---
            if (shopOwnerRes && shopOwnerRes.length > 0 && shopOwnerRes[0].id) {
              user.shop_owner_id = shopOwnerRes[0].id; // L'ID de la table shop_owner
              console.log("✅ BACKEND DEBUG: shop_owner_id assigned to user object:", user.shop_owner_id);
            } else {
              console.warn("⚠️ BACKEND DEBUG: shop_owner_id not found for shop-owner user ID:", userId);
            }
          }

          console.log("4. BACKEND DEBUG: Final user object before resolve():", user);
          resolve(user);
          console.log("--- BACKEND DEBUG: getMe END (resolved) ---");

        } catch (err) {
          console.error("❌ BACKEND DEBUG: Error fetching professional status:", err);
          resolve(user); // Renvoie quand même l'utilisateur, même si pas de statut trouvé
          console.log("--- BACKEND DEBUG: getMe END (error, but resolved user) ---");
        }
      });
    } catch (err) {
      console.error("❌ BACKEND DEBUG: Token verification error:", err);
      reject(new Error("Token invalide ou expiré"));
      console.log("--- BACKEND DEBUG: getMe END (rejected) ---");
    }
  });
}

module.exports = getMe;
