function isGetMethod(req) {
    return req.method === "GET";
}

function isPostMethod(req) {
    return req.method === "POST";
}

function isPatchMethod(req) {
    return req.method === "PATCH";
}

function isDeleteMethod(req) {
    return req.method === "DELETE";
}

module.exports = {
    isGetMethod,
    isPostMethod,
    isPatchMethod,
    isDeleteMethod,
};
