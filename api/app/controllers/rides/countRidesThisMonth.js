// controllers/rides/countRidesThisMonth.js
const ridesModel = require("../../models/rides");
async function countRidesThisMonth() {
  return new Promise((resolve, reject) => {
    ridesModel.countRidesThisMonth((err, count) => {
      if (err) return reject(err);
      resolve(count);
    });
  });
}
module.exports = countRidesThisMonth;
