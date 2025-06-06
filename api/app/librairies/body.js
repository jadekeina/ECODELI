function getBody(req) {
    // Retourne directement le corps de la requête (déjà parsé par express.json)
    return req.body;
}

// Exemple d'utilisation
// app.use(express.json()); doit être activé au préalable dans Express.
module.exports = { getBody };
