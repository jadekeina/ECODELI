const bcrypt = require("bcrypt");
const db = require("../../../config/db");
const crypto = require("crypto");
const sendMail = require("../../librairies/mailer");

// Fonction pour générer un username par défaut
function generateDefaultUsername(firstname, lastname) {
  const cleanFirstname = firstname.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLastname = lastname.toLowerCase().replace(/[^a-z]/g, '');
  const randomNum = Math.floor(Math.random() * 1000);
  return `${cleanFirstname}.${cleanLastname}${randomNum}`;
}

async function createUser(data) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const emailToken = crypto.randomBytes(32).toString("hex");
    
    // Générer un username par défaut si aucun n'est fourni
    const username = data.username || generateDefaultUsername(data.firstname, data.lastname);

    const sql = `
      INSERT INTO users
      (firstname, lastname, username, mail, password, sexe, profilpicture, birthday, email_token, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.firstname,
      data.lastname,
      username,
      data.mail,
      hashedPassword,
      data.sexe || null,
      data.profilpicture || "./public/default-avatar.png",
      data.birthday || null,
      emailToken,
      false
    ];

    const result = await new Promise((resolve, reject) => {
      db.query(sql, values, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });

    const confirmLink = `${process.env.FRONT_URL}/auth/verify-email/${emailToken}`;

    await sendMail({
      to: data.mail,
      subject: "Confirmez votre adresse email",
      html: `<p>Merci pour votre inscription sur EcoDeli.</p>
         <p>Pour activer votre compte, cliquez ici :</p>
         <a href="${confirmLink}">${confirmLink}</a>`
    });

    return {
      id: result.insertId,
      firstname: data.firstname,
      lastname: data.lastname,
      username: username,
      mail: data.mail,
      profilpicture: data.profilpicture || "./public/default-avatar.png",
      role: "client",
      email_verified: false
    };
  } catch (error) {
    console.error("❌ Erreur création utilisateur :", error);
    throw error;
  }
}

module.exports = createUser;
