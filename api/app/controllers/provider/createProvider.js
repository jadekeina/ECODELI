const jwt = require("jsonwebtoken");
const ProviderModel = require("../../models/provider");

async function createProvider(token, data) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const { type_prestation, zone_deplacement } = data;

        if (!type_prestation || !zone_deplacement) {
            throw new Error("Champs requis manquants : type_prestation ou zone_deplacement");
        }

        await new Promise((resolve, reject) => {
            ProviderModel.createProvider(
                userId,
                type_prestation,
                zone_deplacement,
                (err) => (err ? reject(err) : resolve())
            );
        });

        return { message: "Compte prestataire créé avec succès" };
    } catch (err) {
        throw err;
    }
}

module.exports = createProvider;
