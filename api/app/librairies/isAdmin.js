function isAdmin(req, res, next) {
    const user = req.user;

    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé : admin requis" });
    }

    next();
}

module.exports = isAdmin;
