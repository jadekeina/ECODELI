const userModel = require("../../models/users");

async function countUsersLast24h() {
  return new Promise((resolve, reject) => {
    userModel.countUsersLast24h((err, count) => {
      if (err) return reject(err);
      resolve(count);
    });
  });
}

module.exports = countUsersLast24h;
