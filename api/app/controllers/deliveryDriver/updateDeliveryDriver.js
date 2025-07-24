const db = require("../../../config/db");
const generateInvoice = require("../invoices/generateInvoice");

module.exports = async (req, res) => {
    const requestId = req.params.id;
    const { status, delivery_driver_id } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Statut manquant" });
    }

    try {
        // Mise à jour du statut
        await db.query("UPDATE shopowner_requests SET status = ? WHERE id = ?", [status, requestId]);

        // Si on passe en "en_cours", on assigne le livreur
        if (status === "en_cours" && delivery_driver_id) {
            await db.query(
                "UPDATE shopowner_requests SET delivery_driver_id = ? WHERE id = ?",
                [delivery_driver_id, requestId]
            );
        }

        // Si terminé → Paiement, solde, facture
        if (status === "terminee") {
            const [[request]] = await db.query("SELECT * FROM shopowner_requests WHERE id = ?", [requestId]);

            if (!request || !request.delivery_driver_id) {
                return res.status(400).json({ message: "Aucun livreur assigné à cette demande." });
            }

            const montant = request.price; // à ajuster si commission/TVA
            const deliveryDriverId = request.delivery_driver_id;

            // Création paiement
            await db.query(
                "INSERT INTO delivery_driver_payments (delivery_driver_id, shopowner_request_id, montant, statut) VALUES (?, ?, ?, ?)",
                [deliveryDriverId, requestId, montant, "en_attente"]
            );

            // Maj solde du livreur
            await db.query(
                "UPDATE delivery_driver SET solde = solde + ? WHERE id = ?",
                [montant, deliveryDriverId]
            );

            // Génération facture
            await generateInvoice({
                userType: "livreur",
                userId: deliveryDriverId,
                requestType: "shopowner_request",
                requestId,
                amount: montant,
            });
        }

        res.status(200).json({ message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur updateShopOwnerRequestStatus :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
