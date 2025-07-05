const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userModel = require("../../models/users");
const sendMail = require("../../librairies/mailer");

// Fonction utilitaire pour générer un username unique de base
function generateUsername(firstname) {
  const suffix = Math.floor(1000 + Math.random() * 9000); // ex : jade4832
  return `${firstname.toLowerCase()}${suffix}`;
}

async function createUser(data) {
  if (!data.password || !data.mail || !data.firstname || !data.lastname) {
    throw new Error("Champs obligatoires manquants");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const generatedUsername = generateUsername(data.firstname);
  const token = crypto.randomBytes(32).toString("hex");

  const newUser = {
    firstname: data.firstname,
    lastname: data.lastname,
    username: generatedUsername,
    mail: data.mail,
    password: hashedPassword,
    sexe: null,
    profilpicture: "./public/default-avatar.png",
    birthday: null,
    email_token: token,
    email_verified: false,
  };

  return new Promise((resolve, reject) => {
    userModel.createUser(newUser, async (err, result) => {
      if (err) return reject(err);

      try {
        const link = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;
        await sendMail({
          to: data.mail,
          subject: "Confirmez votre adresse email",
          html: `<p>Merci pour votre inscription sur EcoDeli.</p>
                 <p>Pour activer votre compte, cliquez ici :</p>
                 <a href="${link}">${link}</a>`,
        });

        resolve({ id: result.insertId, ...newUser });
      } catch (mailError) {
        reject(mailError);
      }
    });
  });
}

module.exports = createUser;
