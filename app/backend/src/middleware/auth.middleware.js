const { verifyToken } = require("../utils/jwt");

const auth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = auth;