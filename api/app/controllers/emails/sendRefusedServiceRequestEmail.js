const nodemailer = require("nodemailer");
const User = require("../../models/users");
const ServiceRequest = require("../../models/service_requests");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendRefusedServiceRequestEmail = async (requestId) => {
    const request = await ServiceRequest.findById(requestId);
    if (!request) throw new Error("Demande introuvable");

    const user = await new Promise((resolve, reject) => {
        User.getUserById(request.client_id, (err, res) => {
            if (err) return reject(err);
            resolve(res?.[0]);
        });
    });

    if (!user || !user.mail) throw new Error("Utilisateur sans email");

    const mailOptions = {
        from: '"EcoDeli" <no-reply@kls-ecodeli.dev>',
        to: user.mail,
        subject: "Votre demande de prestation a été refusée ❌",
        text: `Bonjour ${user.firstname},

Malheureusement, votre demande de prestation pour le ${request.date} à ${request.heure} a été refusée.

Vous pouvez faire une nouvelle demande à une autre date si vous le souhaitez.

Merci pour votre compréhension.

— L’équipe EcoDeli`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📪 Email de refus envoyé :", info.response);
    return info;
};

module.exports = sendRefusedServiceRequestEmail;
