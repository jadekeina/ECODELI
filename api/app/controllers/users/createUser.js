const bcrypt = require("bcrypt");
const userModel = require("../../models/users");

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

  const newUser = {
    firstname: data.firstname,
    lastname: data.lastname,
    username: generatedUsername,
    mail: data.mail,
    password: hashedPassword,
    sexe: null,
    profilpicture: "./public/default-avatar.png",
    birthday: null
  };

  return new Promise((resolve, reject) => {
    userModel.createUser(newUser, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...newUser });
    });
  });
}

module.exports = createUser;
