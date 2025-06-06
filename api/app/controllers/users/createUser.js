const bcrypt = require("bcrypt");
const userModel = require("../../models/users");

async function createUser(data) {
  if (!data.password) {
    throw new Error("Password is required");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;

  return new Promise((resolve, reject) => {
    userModel.createUser(data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = createUser;
