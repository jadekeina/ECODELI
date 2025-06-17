const db = require("../../config/db");

exports.createUser = (userData, callback) => {
  const sql = `INSERT INTO users (firstname, lastname, username, mail, password, sexe, profilpicture, birthday)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    userData.firstname,
    userData.lastname,
    userData.username,
    userData.mail,
    userData.password,
    userData.sexe,
    userData.profilpicture,
    userData.birthday,
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
