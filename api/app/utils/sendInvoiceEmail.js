const nodemailer = require("nodemailer");
const fs = require("fs");

const sendInvoiceEmail = async ({ to, subject, filePath, filename }) => {
    const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net", // OVH SMTP
        port: 465,
        secure: true,
        auth: {
            user: "no-reply@kls-ecodeli.dev",
            pass: process.env.OVH_SMTP_PASSWORD, // Ajoute dans ton .env
        },
    });

    const mailOptions = {
        from: '"Eco-Deli" <no-reply@kls-ecodeli.dev>',
        to,
        subject,
        text: "Veuillez trouver ci-joint la facture de votre livraison.",
        attachments: [
            {
                filename: filename || "facture.pdf",
                path: filePath,
                contentType: "application/pdf",
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendInvoiceEmail;
