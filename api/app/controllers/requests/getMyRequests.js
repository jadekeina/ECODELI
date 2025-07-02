const requestModel = require("../../models/requests");

async function getMyRequests(userId) {
    return new Promise((resolve, reject) => {
        requestModel.getRequestsByUserId(userId, (err, results) => {
            if (err) {
                console.error("Erreur récupération demandes :", err);
                return reject(err);
            }

            resolve(results);
        });
    });
}

module.exports = getMyRequests;
