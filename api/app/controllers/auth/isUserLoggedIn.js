const isUserLoggedIn = require("../../librairies/user-is-logged-in");

async function getProfile(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    const userPayload = isUserLoggedIn(token);
    console.log("Connecté :", userPayload);

    res.json({ message: "Accès autorisé", data: userPayload });
  } catch (err) {
    res.status(401).json({ message: "Non autorisé" });
  }
}
