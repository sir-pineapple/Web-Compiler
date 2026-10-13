const crypto = require("crypto");
const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

const register = async (email, password) => {
    const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) {
        throw new Error("User already exists");
    }
    const hashed = await hashPassword(password);
    const userId = crypto.randomUUID();
    await pool.query(`INSERT INTO USERS (id, email, password_hash) VALUES ($1, $2, $3)`, [userId, email, hashed]);
    return { userId };
};

const login = async (email, password) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
        throw new Error("Invalid credentials");
    }
    return user;
};

const getMe = async (userId) => {
    const result = await pool.query(`SELECT id, email, created_at FROM users WHERE id = $1`, [userId]);
    return result.rows[0];
};

module.exports = { register, login, getMe };