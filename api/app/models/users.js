const db = require("../../config/db");

exports.createUser = (userData, callback) => {
  const sql = `INSERT INTO users (firstname, lastname, username, mail, password, sexe, profilpicture, birthday, email_token, email_verified)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    userData.firstname,
    userData.lastname,
    userData.username,
    userData.mail,
    userData.password,
    userData.sexe,
    userData.profilpicture,
    userData.birthday,
    userData.email_token,
    userData.email_verified
  ];
  db.query(sql, values, callback);
};

exports.getAllUsers = (callback) => {
  db.query("SELECT * FROM users ORDER BY dateInscription DESC", callback);
};

exports.getUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], callback);
};

exports.getUserByEmail = (mail, callback) => {
  db.query("SELECT * FROM users WHERE mail = ?", [mail], callback);
};

exports.getUserByToken = (token, callback) => {
  db.query("SELECT * FROM users WHERE token = ?", [token], callback);
};


exports.setUserToken = (userId, token, callback) => {
  const sql = "UPDATE users SET token = ?, updated_at = NOW() WHERE id = ?";
  db.query(sql, [token, userId], callback);
};

exports.clearUserToken = (userId, callback) => {
  db.query("UPDATE users SET token = NULL WHERE id = ?", [userId], callback);
};

exports.rawQuery = (sql, values, callback) => {
  db.query(sql, values, callback);
};

exports.deleteUserById = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};

//
// 🔽 FONCTIONS AJOUTÉES POUR CONFIRMATION EMAIL ET RESET PASSWORD 🔽
//

exports.findByToken = (token, callback) => {
  const sql = "SELECT * FROM users WHERE email_token = ?";
  db.query(sql, [token], callback);
};

exports.verifyUserEmail = (userId, callback) => {
  const sql = "UPDATE users SET email_verified = true, email_token = NULL WHERE id = ?";
  db.query(sql, [userId], callback);
};

exports.findByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE mail = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.setResetToken = (userId, token, expires, callback) => {
  const sql = "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?";
  db.query(sql, [token, expires, userId], callback);
};

exports.findByResetToken = (token, callback) => {
  const sql = "SELECT * FROM users WHERE reset_token = ?";
  db.query(sql, [token], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.updatePassword = (userId, hashedPassword, callback) => {
  const sql = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?";
  db.query(sql, [hashedPassword, userId], callback);
};

exports.getUserByEmailToken = (token, callback) => {
  db.query("SELECT * FROM users WHERE email_token = ?", [token], callback);
};

exports.clearUserEmailToken = (id, callback) => {
  db.query("UPDATE users SET email_token = NULL, email_verified = 1 WHERE id = ?", [id], callback);
};

exports.updateEmailToken = (userId, emailToken, expiresAt, callback) => {
  const sql = `UPDATE users SET email_token = ?, email_token_expires = ? WHERE id = ?`;
  const values = [emailToken, expiresAt, userId];
  db.query(sql, values, callback);
};

exports.getUserByMail = (mail, callback) => {
  db.query("SELECT * FROM users WHERE mail = ?", [mail], callback);
};


exports.countUsersLast24h = (callback) => {
  const sql = "SELECT COUNT(*) AS count FROM users WHERE dateInscription >= NOW() - INTERVAL 1 DAY";
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].count);
  });
};

exports.updateLastLogin = (userId, callback) => {
  const sql = "UPDATE users SET last_login = NOW() WHERE id = ?";
  db.query(sql, [userId], callback);
};

exports.countConnectionsLast24h = (callback) => {
  const sql = `
    SELECT COUNT(*) AS count
    FROM users
    WHERE last_login >= CONVERT_TZ(NOW(), 'UTC', 'Europe/Paris') - INTERVAL 1 DAY
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].count);
  });
};

exports.countInscriptionsParJourSemaine = (callback) => {
  const sql = `
    SELECT
      DATE(dateInscription) as day,
      COUNT(*) as count
    FROM users
    WHERE CONVERT_TZ(dateInscription, '+00:00', '+02:00') >= CURDATE() - INTERVAL 6 DAY
    GROUP BY day
    ORDER BY day ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};


exports.getLastUsers = (limit = 5, callback) => {
  const sql = `
    SELECT id, firstname, lastname, mail, profilpicture, role, dateInscription
    FROM users
    ORDER BY dateInscription DESC
    LIMIT ?
  `;
  db.query(sql, [limit], callback);
};

exports.deleteUserById = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};


exports.updateUserById = (id, updates, callback) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  if (!fields.length) return callback(null, null); // Rien à mettre à jour

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  db.query(sql, [...values, id], callback);
};

exports.logUserLogin = (userId, callback) => {
  const sql = "INSERT INTO user_logins (user_id) VALUES (?)";
  db.query(sql, [userId], callback);
};