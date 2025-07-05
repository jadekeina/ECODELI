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
  db.query("SELECT * FROM users", callback);
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
  const sql = "UPDATE users SET token = ? WHERE id = ?";
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
