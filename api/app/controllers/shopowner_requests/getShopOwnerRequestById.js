const pool = require("../../../config/db"); // Assurez-vous que c'est bien 'pool' et non 'db'

module.exports = async (req, res) => {
    const requestId = req.params.id;

    try {
        // --- DÉBUT DE LA MODIFICATION ---
        // Envelopper pool.query dans une Promise
        const rows = await new Promise((resolve, reject) => {
            pool.query( // <-- Utilisation de 'pool.query'
                `
                SELECT s.*, sh.name AS shop_name, sh.address AS shop_address
                FROM shopowner_requests s
                LEFT JOIN shops sh ON s.shop_id = sh.id
                WHERE s.id = ?
                `,
                [requestId],
                (err, result) => {
                    if (err) {
                        console.error("❌ [getShopOwnerRequestById] Erreur SQL :", err);
                        return reject(err);
                    }
                    resolve(result); // result est déjà un tableau de lignes pour mysql2
                }
            );
        });
        // --- FIN DE LA MODIFICATION ---

        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucune annonce trouvée." });
        }

        // Si rows est un tableau de tableaux (comme avec mysql2), il faut prendre rows[0]
        // Si c'est déjà un tableau d'objets, alors rows[0] est correct.
        // La doc mysql2/promise indique que query() retourne [rows, fields].
        // Si votre pool.query() est une version callback, 'result' devrait être 'rows'.
        // Je vais assumer que 'result' est directement le tableau de lignes.
        return res.json(rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'offre :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};
