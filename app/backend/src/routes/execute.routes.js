const express = require("express");
const router = express.Router();

const { executeCode } = require("../controllers/execute.controller");

router.post("/", executeCode);

module.exports = router;