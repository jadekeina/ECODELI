function isPath(route, reqPath) {
    const routeParts = route.split("/").filter(Boolean);
    const pathParts = reqPath.split("/").filter(Boolean);

    if (routeParts.length !== pathParts.length) {
        return false;
    }

    for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const pathPart = pathParts[i];

        if (routePart.startsWith(":")) {
            continue;
        }

        if (routePart !== pathPart) {
            return false;
        }
    }

    return true;
}

// Exemple :
// const isValid = isPath("/api/user/:id", "/api/user/123");
module.exports = { isPath };
