const nodemailer = require("nodemailer");

(async () => {
    let transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
            user: "no-reply@kls-ecodeli.dev",
            pass: "ecodeli-mail"
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Connexion SMTP OK");
    } catch (err) {
        console.error("❌ Connexion SMTP échouée :", err);
    }
})();
