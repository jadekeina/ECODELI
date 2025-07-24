const db = require("../../../config/db");

const findRideById = async (id) => {
    const [rows] = await db
        .promise()
        .query(
            `SELECT rides.*, users.firstname AS client_firstname, users.lastname AS client_lastname, users.mail AS client_email 
             FROM rides 
             JOIN users ON rides.user_id = users.id
             WHERE rides.id = ?`,
            [id]
        );

    return rows[0];
};

module.exports = findRideById;
