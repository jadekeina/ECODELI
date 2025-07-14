const userModel = require("../../models/users");
async function countConnectionsLast24h() {
  return new Promise((resolve, reject) => {
    userModel.countConnectionsLast24h((err, count) => {
      if (err) return reject(err);
      resolve(count);
    });
  });
}
module.exports = countConnectionsLast24h;
