const db = require("../../config/db");

exports.getChiffreAffairesSemaine = (callback) => {
  const sql = `
    SELECT
      IFNULL(SUM(amount), 0) as ca
    FROM payments
    WHERE status = 'succeeded'
      AND created_at >= CURDATE() - INTERVAL 6 DAY
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].ca);
  });
};

