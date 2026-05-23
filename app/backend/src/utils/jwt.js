const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET missing in environment");
}

const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;