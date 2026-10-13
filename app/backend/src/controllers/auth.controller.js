const authService = require("../services/auth.service");
const {generateToken} = require("../utils/jwt");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        const token = generateToken(user.userId);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000
        });
        res.status(201).json({ message: "Registered" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        const token = generateToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production"
        });
        res.json({ message: "Logged In" });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const me = async (req, res) => {
    const user = await authService.getMe(req.userId);
    res.json(user);
};

const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};

module.exports = { register, login, me, logout };