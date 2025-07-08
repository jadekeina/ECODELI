const nodemailer = require("nodemailer");
const Ride = require("../../models/ride");
const User = require("../../models/users");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendConfirmationEmail = async (type, id) => {
    if (type !== "ride") return;

    const ride = await Ride.findRideById(id);
    if (!ride) {
        throw new Error("Course introuvable");
    }

    console.log("📦 Ride récupérée :", ride);

    const user = await new Promise((resolve, reject) => {
        User.getUserById(ride.user_id, (err, result) => {
            if (err) return reject(err);
            resolve(result?.[0]);
        });
    });


    if (!user || !user.mail) {
        console.error("⚠️ Problème avec l'utilisateur :", user);
        throw new Error("Utilisateur introuvable ou sans email");
    }

    console.log("🚀 Utilisateur récupéré :", user);

    const path = require("path");

    const filePath = path.resolve(__dirname, "../../storage/invoices/ride-" + id + ".pdf");

    const info = await transporter.sendMail({
        from: '"EcoDeli" <no-reply@kls-ecodeli.dev>',
        to: user.mail,
        subject: "Votre course est confirmée ✅",
        text: `Bonjour,\n\nVotre course du ${ride.depart_address} à ${ride.arrivee_address} a bien été confirmée. Montant total : ${ride.total_price} €.\n\nMerci pour votre confiance !`,
        attachments: [
            {
                filename: `facture-ride-${id}.pdf`,
                path: filePath,
            },
        ],
    });


    return info;
};

module.exports = sendConfirmationEmail;
