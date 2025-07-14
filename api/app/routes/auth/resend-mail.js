const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../../librairies/response");
const sendMail = require("../../librairies/mailer");
const userModel = require("../../models/users");
const crypto = require("crypto");

router.post("/", (req, res) => {
    const { mail } = req.body;

    if (!mail) {
        return jsonResponse(res, 400, {}, { message: "Adresse mail manquante" });
    }

    userModel.getUserByEmail(mail, (err, results) => {
        if (err) return jsonResponse(res, 500, {}, { message: "Erreur serveur" });

        if (results.length === 0) {
            return jsonResponse(res, 404, {}, { message: "Aucun utilisateur trouvé" });
        }

        const user = results[0];

        if (user.email_verified) {
            return jsonResponse(res, 400, {}, { message: "Email déjà confirmé" });
        }

        const emailToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        userModel.updateEmailToken(user.id, emailToken, expiresAt, async (updateErr) => {
            if (updateErr) return jsonResponse(res, 500, {}, { message: "Erreur enregistrement token" });

            const confirmLink = `${process.env.BACKEND_URL}/verify-email/${emailToken}`;


            await sendMail({
                to: data.mail, // ou `mail` selon le contexte
                subject: "Confirmez votre adresse email",
                html: `<p>Merci pour votre inscription sur EcoDeli.</p>
                 <p>Pour activer votre compte, cliquez ici :</p>
                 <a href="${confirmLink}">${confirmLink}</a>`
                    });




            return jsonResponse(res, 200, {}, { message: "Mail de confirmation renvoyé" });
        });
    });
});

module.exports = router;
