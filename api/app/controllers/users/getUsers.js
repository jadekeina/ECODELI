const userModel = require("../../models/users");

async function getUsers(id = null) {
  return new Promise((resolve, reject) => {
    if (id) {
      userModel.getUserById(id, (err, result) => {
        if (err) return reject(err);
        if (!result.length) return reject(new Error("User not found"));
        resolve(result[0]);
      });
    } else {
      userModel.getAllUsers((err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    }
  });
}

module.exports = getUsers;
