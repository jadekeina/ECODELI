const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendMail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"EcoDeli" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`📧 Mail envoyé à ${to}`);
        console.log("📨 Détails :", info);
    } catch (error) {
        console.error(`❌ Échec d'envoi de mail à ${to} :`, error);
        throw error;
    }
};

module.exports = sendMail;
