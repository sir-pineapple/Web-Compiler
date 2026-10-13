const express = require("express");
const { debug } = require("../controllers/debug.controller");
const router = express.Router();

router.post("/", debug);

module.exports = router;