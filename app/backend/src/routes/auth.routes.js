const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { register, login, me, logout } = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);

router.get("/me", auth, me);

router.post("/logout", auth, logout);

module.exports = router;