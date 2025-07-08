const db = require("../../config/db");

exports.getAllWarehouses = (callback) => {
    const sql = `
    SELECT w.*, COUNT(b.id) AS total_boxes,
      SUM(CASE WHEN b.etat = 'libre' THEN 1 ELSE 0 END) AS available_boxes
    FROM warehouse w
    LEFT JOIN box b ON b.entrepot_id = w.id
    GROUP BY w.id
    ORDER BY w.id ASC
  `;
    db.query(sql, callback);
};
