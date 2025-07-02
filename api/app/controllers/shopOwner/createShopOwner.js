const jwt = require("jsonwebtoken");
const ShopOwnerModel = require("../../models/shopOwner");
const AddressModel = require("../../models/address");
const DocumentModel = require("../../models/documents");

async function createShopOwner(token, data, file) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const { nom_entreprise, siret, adresse } = data;
    if (!nom_entreprise || !siret || !adresse) {
        throw new Error("Champs 'nom_entreprise', 'siret' ou 'adresse' manquants");
    }

    const business_address_id = await new Promise((resolve, reject) => {
        AddressModel.insertAddress(adresse, (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
        });
    });

    await new Promise((resolve, reject) => {
        ShopOwnerModel.createShopOwner(
            userId,
            nom_entreprise,
            siret,
            business_address_id,
            (err) => (err ? reject(err) : resolve())
        );
    });

    // ✅ Enregistrement du fichier SIRET dans documents_justificatifs
    if (file?.path) {
        await new Promise((resolve, reject) => {
            DocumentModel.insertDocument(userId, "siret", file.path, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    return { message: "Profil commerçant créé avec succès" };
}

module.exports = createShopOwner;
