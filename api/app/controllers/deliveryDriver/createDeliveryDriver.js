const jwt = require("jsonwebtoken");
const DeliveryModel = require("../../models/deliveryDriver");

async function createDeliveryDriver(token, data) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const { zone_deplacement } = data;

    if (!zone_deplacement) {
        throw new Error("Champ 'zone_deplacement' manquant");
    }

    await new Promise((resolve, reject) => {
        DeliveryModel.createDeliveryDriver(userId, zone_deplacement, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = createDeliveryDriver;
