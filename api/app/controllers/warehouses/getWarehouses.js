const warehouseModel = require("../../models/warehouses");

function getWarehouses(req, res) {
    warehouseModel.getAllWarehouses((err, results) => {
        if (err) {
            console.error("Erreur récupération entrepôts :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        return res.status(200).json({
            message: "Entrepôts récupérés ✅",
            data: results,
        });
    });
}

module.exports = getWarehouses;
