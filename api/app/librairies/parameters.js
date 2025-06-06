function getParametersForRoute(route, reqPath) {
    const routeParts = route.split("/").filter(Boolean);
    const pathParts = reqPath.split("/").filter(Boolean);

    if (routeParts.length !== pathParts.length) {
        return false;
    }

    const parameters = {};

    for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const pathPart = pathParts[i];

        if (routePart.startsWith(":")) {
            const paramName = routePart.slice(1);
            parameters[paramName] = pathPart;
        } else if (routePart !== pathPart) {
            return false;
        }
    }

    return parameters;
}

// Exemple :
// const params = getParametersForRoute("/api/user/:id", "/api/user/123");
module.exports = { getParametersForRoute };
