function getAuthorizationBearerToken(req) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return null;
    }

    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer" || !token) {
        return null;
    }

    return token;
}

module.exports = { getAuthorizationBearerToken };
