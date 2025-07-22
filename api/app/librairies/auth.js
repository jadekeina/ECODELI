const jwt = require("jsonwebtoken");
const { jsonResponse } = require("../librairies/response");

const JWT_SECRET = process.env.SECRET_KEY || "vraiment_pas_secure";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return jsonResponse(res, 401, {}, { message: "Token manquant" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.userId,
            email: decoded.mail,
            role: decoded.role,
            status: decoded.status,
        };
        next();
    } catch (error) {
        console.error("Erreur vérification token JWT :", error);
        return jsonResponse(res, 401, {}, { message: "Token invalide ou expiré" });
    }
};

module.exports = auth;
