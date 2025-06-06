function jsonResponse(res, statusCode, headers, body) {
    res.status(statusCode);
    Object.entries(headers).forEach(([key, value]) => {
        res.set(key, value);
    });
    res.json(body);
}

// Exemple :
// jsonResponse(res, 200, { "X-Custom-Header": "value" }, { message: "Hello World" });
module.exports = { jsonResponse };
